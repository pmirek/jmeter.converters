"use strict";

// requires jmeter.elements.js
// requires jmeter.helpers.js

//----------------------------------------------------
// MAIN LOGIC
//----------------------------------------------------

//----------------------------------------------------
function soapui2jmx(input) {


 var soapui = "";
 var parser = null;
 if (window.DOMParser)
 {
     parser = new DOMParser();
     soapui = parser.parseFromString(input, "text/xml");
 }
 else // Internet Explorer
 {
     soapui = new ActiveXObject("Microsoft.XMLDOM");
     soapui.async = false;
     soapui.loadXML(input);
 }

 var outputLog = "";
 var outputJmx = "";

 //var reqNum = 0;
 //var startTime = "";
 //var method = "";
 //var protocol = "";
 //var url = document.createElement('a');
 //var domain = "";
 //var port = "";
 //var path = "";
 var threadGroupsPrepared = "";
 var controlersPrepared = "";
 var samplersPrepared = "";
 var samplerPrepared = "";
 var outputPrepared = "";

 var i=0;
 var j=0;
 var k=0;
 var testSuiteNodes=null;
 var testCaseNodes=null;
 var testStepNodes=null;

 var testInterafaceNodes=null;
 var testOperationNodes=null;
 var testCallNodes=null;
 var soapAction="";

 outputLog += "\n#########################\nTEST SUITES\n#########################\n";

 // TEST SUITE -> thread group
 testSuiteNodes=soapui.documentElement.getElementsByTagName("con:testSuite");
 for (i = 0; i < testSuiteNodes.length ;i++) {
  outputLog += "\n" + testSuiteNodes[i].attributes.name.value + " [" + check_enabled(testSuiteNodes[i]) + "]\n";

  // TEST CASE -> simple controller
  controlersPrepared = "";
  testCaseNodes=testSuiteNodes[i].getElementsByTagName("con:testCase");
  for (j = 0; j < testCaseNodes.length ;j++) {
   outputLog += " * " + testCaseNodes[j].attributes.name.value + " [" + check_enabled(testCaseNodes[j]) + "]\n";

   // TEST STEP -> request
   // soap req = con:testStep type="request"
   // rest req = con:testStep type="restrequest"
   // http req = con:testStep type="httprequest"
   testStepNodes = testCaseNodes[j].getElementsByTagName("con:testStep");
   samplersPrepared="";
   for (k = 0; k < testStepNodes.length ;k++){
    if (testStepNodes[k].attributes.type != null){ 
     if (testStepNodes[k].attributes.type.value == "request") { 
      outputPrepared = process_soapReq(testStepNodes[k]);
      outputLog += outputPrepared[0];
      samplersPrepared += outputPrepared[1];
     }
     if (testStepNodes[k].attributes.type.value == "restrequest") {
      outputPrepared = process_restReq(testStepNodes[k]);
      outputLog += outputPrepared[0];
      samplersPrepared += outputPrepared[1];
     }
     if (testStepNodes[k].attributes.type.value == "httprequest") {
      outputPrepared = process_httpReq(testStepNodes[k]);
      outputLog += outputPrepared[0];
      samplersPrepared += outputPrepared[1];
     }
    }
   }// TEST STEP

   controlersPrepared += printGenericController (testCaseNodes[j].attributes.name.value, check_enabled(testCaseNodes[j]), samplersPrepared);
  }// TEST CASE

  threadGroupsPrepared += printThreadGroup("TestSuite_" + testSuiteNodes[i].attributes.name.value, check_enabled(testSuiteNodes[i]), controlersPrepared);
 }// TEST SUITE


 outputLog += "\n#########################\nINTERFACES\n#########################\n";

 i=0;
 j=0;
 k=0;
 // INTERFACE -> thread group
 testInterafaceNodes=soapui.documentElement.getElementsByTagName("con:interface");
 for (i = 0; i < testInterafaceNodes.length ;i++) {
  if (testInterafaceNodes[i].attributes.name != null){
   outputLog += "\n" + testInterafaceNodes[i].attributes.name.value + "\n";

   // OPERATION -> simple controller
   controlersPrepared = "";
   testOperationNodes=testInterafaceNodes[i].getElementsByTagName("con:operation");
   for (j = 0; j < testOperationNodes.length ;j++) {
    soapAction=testOperationNodes[j].attributes.action.value;
    outputLog += " * " + testOperationNodes[j].attributes.name.value + "\n";

    // CALL -> sampler
    testCallNodes=testOperationNodes[j].getElementsByTagName("con:call");
    samplersPrepared="";
    for (k = 0; k < testCallNodes.length ;k++){
     outputPrepared = process_soapCall(testCallNodes[k],soapAction);
     outputLog += outputPrepared[0];
     samplersPrepared += outputPrepared[1];
    }
    // CALL
    

    controlersPrepared += printGenericController (testOperationNodes[j].attributes.name.value, "true", samplersPrepared);
   }
   // OPERATION 

   threadGroupsPrepared += printThreadGroup("Interface_" + testInterafaceNodes[i].attributes.name.value, "false", controlersPrepared);
  }
 }
 // INTERFACE


 outputJmx = printTestPlan(threadGroupsPrepared + printViewResultsTree());
 return [outputLog,outputJmx];
}

//----------------------------------------------------
// HELPERS SECTION
//----------------------------------------------------

function check_enabled (object){

 var enabled = "false";
 if (object.attributes.disabled == null){
  enabled = "true";
 }else{
  enabled = "false";
 }
 return enabled
}

function process_soapCall (object,soapAction){
 var output="";
 var headersPrepared="";
 var jmeterSampler="";
 if (object.getElementsByTagName("con:endpoint")[0] != null){
  // REQUEST
  var requestNode = object.getElementsByTagName("con:endpoint")[0].parentNode;
     
  var endpoint =  requestNode.getElementsByTagName("con:endpoint")[0].textContent;
  var encoding = requestNode.getElementsByTagName("con:encoding")[0].textContent;
  var request = requestNode.getElementsByTagName("con:request")[0].textContent;

  headersPrepared += printHeader("Content-Type", "text/xml");
  headersPrepared += printHeader("SOAPAction", soapAction);
  jmeterSampler=printHTTPSamplerProxy(object.attributes.name.value,
                                      check_enabled(object),
                                      "",
                                      "80",
                                      "http",
                                      endpoint,
                                      encoding,
                                      "POST",
                                      printReqArgsPostDataRaw(request),
                                      printHeaderManager(headersPrepared)
                                     );
  
 }
 return [output,jmeterSampler];
}


function process_soapReq (object){
 var output="";
 var headersPrepared="";
 var jmeterSampler="";
 output += "   * [" + object.attributes.type.value + "] "
                    + object.attributes.name.value + " ["
                    + check_enabled(object) + "]\n";
 if (object.getElementsByTagName("con:endpoint")[0] != null){
  // REQUEST
  var requestNode = object.getElementsByTagName("con:endpoint")[0].parentNode;
     
  var endpoint =  requestNode.getElementsByTagName("con:endpoint")[0].textContent;
  var encoding = requestNode.getElementsByTagName("con:encoding")[0].textContent;
  var request = requestNode.getElementsByTagName("con:request")[0].textContent;

  output += "     * edp:[" + endpoint + "]\n";
  output += "     * enc:[" + encoding + "]\n";

  headersPrepared += printHeader("Content-Type", "text/xml");
  jmeterSampler=printHTTPSamplerProxy(object.attributes.name.value,
                                      check_enabled(object),
                                      "",
                                      "80",
                                      "http",
                                      endpoint,
                                      encoding,
                                      "POST",
                                      printReqArgsPostDataRaw(request),
                                      printHeaderManager(headersPrepared)
                                     );
  
 }
 return [output,jmeterSampler];
}

function process_restReq (object){
 var output="";
 var jmeterSampler="";
 output += "   * [" + object.attributes.type.value + "] "
              + object.attributes.name.value + " ["
              + check_enabled(object) + "]\n";
 if (object.getElementsByTagName("con:endpoint")[0] != null){
  // REQUEST
  var requestNode = object.getElementsByTagName("con:endpoint")[0].parentNode;
     
  output += "     * edp:[" + requestNode.getElementsByTagName("con:endpoint")[0].textContent + "]\n";
 }
 return [output,jmeterSampler];
}

function process_httpReq (object){
 var output="";
 var jmeterSampler="";
 output += "   * [" + object.attributes.type.value + "] "
              + object.attributes.name.value + " ["
              + check_enabled(object) + "]\n";
 if (object.getElementsByTagName("con:endpoint")[0] != null){
  // REQUEST
  var requestNode = object.getElementsByTagName("con:endpoint")[0].parentNode;
     
  output += "     * edp:[" + requestNode.getElementsByTagName("con:endpoint")[0].textContent + "]\n";
 }
 return [output,jmeterSampler];
}

