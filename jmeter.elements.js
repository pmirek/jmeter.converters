"use strict";

//----------------------------------------------------
// JMETER ELEMENTS
//----------------------------------------------------


//----------------------------------------------------
// TEST PLAN
//----------------------------------------------------
function printTestPlan (threadGroupsPrepared) {
 var outputTxt=`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.1.1 r1855137">

  <hashTree> <!-- under jmeterTestPlan -->
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Test Plan" enabled="true">
      <stringProp name="TestPlan.comments"></stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.tearDown_on_shutdown">true</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
      <stringProp name="TestPlan.user_define_classpath"></stringProp>
    </TestPlan>

  <hashTree> <!-- under TestPlan -->
${threadGroupsPrepared}
  </hashTree> <!-- end of tree under TestPlan -->

</hashTree> <!-- end of tree under jmeterTestPlan -->

</jmeterTestPlan>

 `;
 return outputTxt;
}


//----------------------------------------------------
// THREAD GROUP
//----------------------------------------------------
function printThreadGroup(threadGroupName,threadGroupEnabled,threadGroupBody) {
 var outputTxt=`
    <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="${threadGroupName}" enabled="${threadGroupEnabled}">
      <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
      <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
        <boolProp name="LoopController.continue_forever">false</boolProp>
        <stringProp name="LoopController.loops">1</stringProp>
      </elementProp>
      <stringProp name="ThreadGroup.num_threads">1</stringProp>
      <stringProp name="ThreadGroup.ramp_time">1</stringProp>
      <boolProp name="ThreadGroup.scheduler">false</boolProp>
      <stringProp name="ThreadGroup.duration"></stringProp>
      <stringProp name="ThreadGroup.delay"></stringProp>
    </ThreadGroup>
      <hashTree> <!-- under ThreadGroup -->

${threadGroupBody}

     </hashTree> <!-- end of tree under ThreadGroup -->
`;
 return outputTxt;
}


//----------------------------------------------------
// GENERIC CONTROLLER
//----------------------------------------------------
function printGenericController(controlerName, controllerEnabled, samplersPrepared) {
 var outputTxt=`
        <GenericController guiclass="LogicControllerGui" testclass="GenericController" testname="${controlerName}" enabled="${controllerEnabled}"/>
        <hashTree>
${samplersPrepared}
        </hashTree>
`;
 return outputTxt;
}


//----------------------------------------------------
// HTTP SAMPLER PROXY
//----------------------------------------------------
function printHTTPSamplerProxy(samplerName, enabled, domain, port, protocol, path, encoding, method, reqArgs, reqHeaders) {
 samplerName=encodeXml(samplerName);
 var outputTxt=`
      <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="${samplerName}" enabled="${enabled}">
${reqArgs}
        <stringProp name="HTTPSampler.domain">${domain}</stringProp>
        <stringProp name="HTTPSampler.port">${port}</stringProp>
        <stringProp name="HTTPSampler.protocol">${protocol}</stringProp>
        <stringProp name="HTTPSampler.contentEncoding">${encoding}</stringProp>
        <stringProp name="HTTPSampler.path">${path}</stringProp>
        <stringProp name="HTTPSampler.method">${method}</stringProp>
        <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
        <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
        <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
        <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
        <stringProp name="HTTPSampler.embedded_url_re"></stringProp>
        <stringProp name="HTTPSampler.connect_timeout"></stringProp>
        <stringProp name="HTTPSampler.response_timeout"></stringProp>
      </HTTPSamplerProxy>
      <hashTree> <!-- under HTTPSamplerProxy -->
${reqHeaders}
    </hashTree> <!-- HTTPSamplerProxy -->
`;
 return outputTxt;
}


//----------------------------------------------------
// HTTP SAMPLER PROXY
//----------------------------------------------------
function printReqArgsGet() {
 var outputTxt=`
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" enabled="true">
            <collectionProp name="Arguments.arguments"/>
          </elementProp>
`;
 return outputTxt;
}


//----------------------------------------------------
// GET ARGUMENTS (HTTP SAMPLER PROXY)
//----------------------------------------------------
function printReqArgsGet(paramsPrepared) {
 var outputTxt=`
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" enabled="true">
            <collectionProp name="Arguments.arguments">
${paramsPrepared}
            </collectionProp>
          </elementProp>
`;
 return outputTxt;
}


//----------------------------------------------------
// POST (HTTP SAMPLER PROXY)
//----------------------------------------------------
function printQueryDataParam(paramName,paramValue) {
 paramName=encodeXml(paramName);
 paramValue=encodeXml(paramValue);
 var outputTxt=`
              <elementProp name="${paramName}" elementType="HTTPArgument">
                <boolProp name="HTTPArgument.always_encode">true</boolProp>
                <stringProp name="Argument.name">${paramName}</stringProp>
                <stringProp name="Argument.value">${paramValue}</stringProp>
                <stringProp name="Argument.metadata">=</stringProp>
                <boolProp name="HTTPArgument.use_equals">true</boolProp>
              </elementProp>
`;
 return outputTxt;
}


//----------------------------------------------------
// POST RAW DATA BODY (HTTP SAMPLER PROXY)
//----------------------------------------------------
function printReqArgsPostDataRaw(postTxt) {
 postTxt=encodeXml(postTxt);
 var outputTxt=`
        <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
        <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
          <collectionProp name="Arguments.arguments">
            <elementProp name="" elementType="HTTPArgument">
              <boolProp name="HTTPArgument.always_encode">false</boolProp>
              <stringProp name="Argument.value">${postTxt}</stringProp>
              <stringProp name="Argument.metadata">=</stringProp>
            </elementProp>
          </collectionProp>
        </elementProp>
`;
 return outputTxt;
}


//----------------------------------------------------
// POST PARMETERS LIST (HTTP SAMPLER PROXY)
//----------------------------------------------------
function printReqArgsPostDataParams(paramsPrepared) {
 var outputTxt=`
         <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" enabled="true">
            <collectionProp name="Arguments.arguments">
${paramsPrepared}
            </collectionProp>
          </elementProp>
`;
 return outputTxt;
}

//----------------------------------------------------
// POST PARMETER (POST PARMETERS LIST)
//----------------------------------------------------
function printPostDataParam(paramName,paramValue) {
 paramName=encodeXml(paramName);
 paramValue=encodeXml(paramValue);
 var outputTxt=`
              <elementProp name="${paramName}" elementType="HTTPArgument">
                <boolProp name="HTTPArgument.always_encode">false</boolProp>
                <stringProp name="Argument.name">${paramName}</stringProp>
                <stringProp name="Argument.value">${paramValue}</stringProp>
                <stringProp name="Argument.metadata">=</stringProp>
                <boolProp name="HTTPArgument.use_equals">true</boolProp>
              </elementProp>
`;
 return outputTxt;
}

//----------------------------------------------------
// HEADER MANAGER - empty
//----------------------------------------------------
function printHeaderManagerEmpty() {
 var outputTxt=`
      <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
        <collectionProp name="HeaderManager.headers"/>
      </HeaderManager>
      <hashTree/>
`;
 return outputTxt;
}


//----------------------------------------------------
// HEADER MANGER
//----------------------------------------------------
function printHeaderManager(headersPrepared) {
 var outputTxt=`
        <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
          <collectionProp name="HeaderManager.headers">
${headersPrepared}
          </collectionProp>
        </HeaderManager>
      <hashTree/> <!-- end of tree under HeaderManager -->
`;
 return outputTxt;
}


//----------------------------------------------------
// HEADER (HEADER MANGER)
//----------------------------------------------------
function printHeader (headerName,headerValue) {
 headerName=encodeXml(headerName);
 headerValue=encodeXml(headerValue);
 var outputTxt=`
            <elementProp name="${headerName}" elementType="Header">
              <stringProp name="Header.name">${headerName}</stringProp>
              <stringProp name="Header.value">${headerValue}</stringProp>
            </elementProp>
`;
 return outputTxt;
}


//----------------------------------------------------
// COOKIE MANAGER - empty
//----------------------------------------------------
function printCookieManagerEmpty() {
 var outputTxt=`
      <CookieManager guiclass="CookiePanel" testclass="CookieManager" testname="HTTP Cookie Manager" enabled="true">
        <collectionProp name="CookieManager.cookies"/>
        <boolProp name="CookieManager.clearEachIteration">false</boolProp>
      </CookieManager>
      <hashTree/>
`;
 return outputTxt;
}


//----------------------------------------------------
// VIEW RESULTS TREE
//----------------------------------------------------
function printViewResultsTree() {
 var outputTxt=`
      <ResultCollector guiclass="ViewResultsFullVisualizer" testclass="ResultCollector" testname="View Results Tree" enabled="true">
        <boolProp name="ResultCollector.error_logging">false</boolProp>
        <objProp>
          <name>saveConfig</name>
          <value class="SampleSaveConfiguration">
            <time>true</time>
            <latency>true</latency>
            <timestamp>true</timestamp>
            <success>true</success>
            <label>true</label>
            <code>true</code>
            <message>true</message>
            <threadName>true</threadName>
            <dataType>true</dataType>
            <encoding>false</encoding>
            <assertions>true</assertions>
            <subresults>true</subresults>
            <responseData>true</responseData>
            <samplerData>true</samplerData>
            <xml>true</xml>
            <fieldNames>true</fieldNames>
            <responseHeaders>false</responseHeaders>
            <requestHeaders>false</requestHeaders>
            <responseDataOnError>false</responseDataOnError>
            <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
            <assertionsResultsToSave>0</assertionsResultsToSave>
            <bytes>true</bytes>
            <sentBytes>true</sentBytes>
            <url>true</url>
            <threadCounts>true</threadCounts>
            <idleTime>true</idleTime>
            <connectTime>true</connectTime>
          </value>
        </objProp>
        <stringProp name="filename"></stringProp>
      </ResultCollector>
`;
 return outputTxt;
}
