/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var connToken = "90938232|-31949273527876685|90952473";
var dbName = "School-DB";
var relationName = "Student-Table";
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";

$('#studId').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('rec_no', lvData.rec_no);
}

function getStudIdAsJsonObj(){
    var studId = $('#studId').val();
    var jsonStr = {
        id : studId
    };
    return JSON.stringify(jsonStr);
}
function validateData(){
    var studId, studName, studClass, studDob, studAddress, studEnrol;
    studId = $('#studId').val();
    studName = $('#studName').val();
    studClass = $('#studClass').val();
    studDob = $('#studDob').val();
    studAddress = $('#studAddress').val();
    studEnrol = $('#studEnrol').val();
    
    if (studId === ''){
        alert('Student\'s Roll Number is Required. Please Enter the Roll Number.');
        $('#studId').focus();
        return "";
    }
    if (studName === ''){
        alert('Student\'s Full Name is Required. Please Enter the students full name.');
        $('#studName').focus();
        return "";
    }
    if (studClass === ''){
        alert('Student\'s Class is Required. Please Enter the Class.');
        $('#studClass').focus();
        return "";
    }
    if (studDob === ''){
        alert('Student\'s Date of Birth is Required. Please Enter the Birth Date of the student.');
        $('#studDob').focus();
        return "";
    }
    if (studAddress === ''){
        alert('Student\'s Address is Required. Please Enter the Address.');
        $('#studAddress').focus();
        return "";
    }
    if (studEnrol === ''){
        alert('Student\'s Enrolment Date is Required. Please Enter the Enrolment date.');
        $('#studEnrol').focus();
        return "";
    }
    var jsonStrObj = {
        rollno: studId,
        fullname: studName,
        class: studClass,
        birthdate: studDob,
        address: studAddress,
        enrolmentdate: studEnrol
    };

    return JSON.stringify(jsonStrObj);
}
function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#studName').val(data.fullname);
    $('#studClass').val(data.class);
    $('#studDob').val(data.birthdate);
    $('#studAddress').val(data.address);
    $('#studEnrol').val(data.enrolmentdate);
    
    setRecord();
    
}

function resetRecord(){
    $('#studId').val("");
    $('#studName').val("").prop("disabled", true);
    $('#studClass').val("").prop("disabled", true);
    $('#studDob').val("").prop("disabled", true);
    $('#studAddress').val("").prop("disabled", true);
    $('#studEnrol').val("").prop("disabled", true);
    $('#studId').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#studId').focus();   
    
    setRecord();
}

function setRecord(){
     $("#studName").prop("disabled", false);
     $("#studClass").prop("disabled", false);
     $("#studDob").prop("disabled", false);
     $("#studAddress").prop("disabled", false);
     $("#studEnrol").prop("disabled", false);
     $("#reset").prop("disabled", false);
}

function getStudent(){
    var studIdJsonObj = getStudIdAsJsonObj();
    var getRequest = createGET_BY_KEYREquest(connToken,dbName,relationName, studIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status === 400){
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#studName').focus();
        
    } else if  (resJsonObj.status === 200){
        $('#studId').prop('disabled', true);
        fillData(resJsonObj);
        
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#studName').focus(); 
    }
}

function saveRecord(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj,dbName, relationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetRecord();
    $('#studId').focus();
}

function changeRecord() {
    $("#change").prop('disabled', true);
    jsonChg = validateData();
    if(jsonChg ===""){
        return ;
    }
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, dbName, relationName, localStorage.getItem("rec_no"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    if (resJsonObj.status === 200) {
        alert("Data updated Successfully");
    } else if (resJsonObj.status === 401) {
        alert("Invalid Token");
    } else if (resJsonObj.status === 400) {
        alert("Something went wrong,Try after some time");
    }
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetRecord();
    $('#studId').focus();
}



