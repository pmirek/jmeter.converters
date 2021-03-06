"use strict";

//----------------------------------------------------
// HELPERS 
//----------------------------------------------------


//----------------------------------------------------
// TRANSLATE SPECIALS TO XML ESCAPES 
//----------------------------------------------------
var xml_to_escaped = {
 '&': '&amp;',
 '"': '&quot;',
 '<': '&lt;',
 '>': '&gt;'
};


//----------------------------------------------------
// TRANSLATE XML ESCAPES TO SPECIALS 
//----------------------------------------------------
var escaped_to_xml = {
 '&quot;': '"',
 '&lt;': '<',
 '&gt;': '>'
};


//----------------------------------------------------
// ENCODE TO VALID XML STRING 
//----------------------------------------------------
function encodeXml(string) {
 return string.replace(/([\&"<>])/g, function(str, item) { return xml_to_escaped[item]; });
};


//----------------------------------------------------
// DECODE XML TO READIBLE TEXT 
//----------------------------------------------------
function decodeXml(string) {
 return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g, function(str, item) { return escaped_to_xml[item]; }).replace(/&amp;/g,'&');
};

