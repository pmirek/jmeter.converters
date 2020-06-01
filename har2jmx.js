"use strict";

// requires jmeter.elements.js
// requires jmeter.helpers.js

//----------------------------------------------------
// MAIN LOGIC
//----------------------------------------------------

//----------------------------------------------------
function har2jmx(input) {

 var har = JSON.parse(input);
 var output = "";
 var outputLog = "";
 var outputJmx = "";

 var reqNum = 0;
 var startTime = "";
 var method = "";
 var protocol = "";
 var url = document.createElement('a');
 var domain = "";
 var port = "";
 var path = "";
 var samplersPrepared = "";
 var threadGroupsPrepared = "";

 var reqArgs = "";
 var reqHeaders = "";
 var paramsPrepared = "";
 var postParamNum = 0;
 var postParamName = "";
 var postParamValue = "";
 var queryParamNum = 0;
 var queryParamName = "";
 var queryParamValue = "";
 var headersPrepared = "";
 var headerNum = 0;
 var headerName = "";
 var headerValue = "";


 for (reqNum=0; reqNum < har.log.entries.length; reqNum++){

  url.href = har.log.entries[reqNum].request.url;

  startTime = har.log.entries[reqNum].startedDateTime;
  outputLog = outputLog + "[" + startTime + "]\n";

  method = har.log.entries[reqNum].request.method;
  protocol = url.protocol.substring(0, url.protocol.length - 1);
  domain = url.hostname;
  port = url.port;
  path = url.pathname;

  outputLog = outputLog + "[" + method  + "]";
  outputLog = outputLog + " [" + url.href + "]\n";

  paramsPrepared = "";
  if (har.log.entries[reqNum].request.postData){
   outputLog = outputLog + " post data:\n";

   // if both present, [Parameters] are prefered over [Body Data]
   if (har.log.entries[reqNum].request.postData.params){
    if (har.log.entries[reqNum].request.postData.params.length > 0){
     outputLog = outputLog + "  post params:\n";
     for (postParamNum = 0; postParamNum < har.log.entries[reqNum].request.postData.params.length; postParamNum++){
      postParamName = har.log.entries[reqNum].request.postData.params[postParamNum].name;
      postParamValue = har.log.entries[reqNum].request.postData.params[postParamNum].value;
      outputLog = outputLog + "   [" + postParamName + "] [" + postParamValue + "]\n";
      paramsPrepared = paramsPrepared + printPostDataParam(postParamName,postParamValue);
     }
     reqArgs = printReqArgsPostDataParams(paramsPrepared);
    }else{
     if (har.log.entries[reqNum].request.postData.text){
      paramsPrepared = har.log.entries[reqNum].request.postData.text;
      outputLog = outputLog + "  post body data:\n";
      outputLog = outputLog + "   [" + paramsPrepared + "]\n";
      reqArgs = printReqArgsPostDataRaw(paramsPrepared);
     }
    }
   }

  }else{
   if (har.log.entries[reqNum].request.queryString.length>0){
     for (queryParamNum = 0; queryParamNum < har.log.entries[reqNum].request.queryString.length; queryParamNum++){
       queryParamName = har.log.entries[reqNum].request.queryString[queryParamNum].name;
       queryParamValue = har.log.entries[reqNum].request.queryString[queryParamNum].value;
       outputLog = outputLog + "  [" + queryParamName + "] [" + queryParamValue + "]\n";
       paramsPrepared = paramsPrepared + printQueryDataParam(queryParamName,queryParamValue);
     }
     reqArgs = printReqArgsGet(paramsPrepared);
   }else{
     reqArgs = printReqArgsGet();
   }
  }

  headersPrepared = "";
  if (har.log.entries[reqNum].request.headers){
   outputLog = outputLog + " headers data:\n";
   for (headerNum = 0; headerNum < har.log.entries[reqNum].request.headers.length; headerNum++){
    headerName = har.log.entries[reqNum].request.headers[headerNum].name;
    headerValue = har.log.entries[reqNum].request.headers[headerNum].value;
    outputLog = outputLog + "  [" + headerName + "] [" + headerValue + "]\n";
    headersPrepared = headersPrepared + printHeader (headerName,headerValue);
   }
   reqHeaders = printHeaderManager(headersPrepared);
  }
  outputLog = outputLog + "\n";

  samplersPrepared = samplersPrepared + printHTTPSamplerProxy(startTime + " " + path, "true", domain, port, protocol, path, "", method, reqArgs, reqHeaders);
 }

 threadGroupsPrepared = printThreadGroup("generated.from.har","true",samplersPrepared);
 outputJmx = printTestPlan(printHeaderManagerEmpty() + printCookieManagerEmpty() + threadGroupsPrepared + printViewResultsTree());

 return [outputLog,outputJmx];
}
