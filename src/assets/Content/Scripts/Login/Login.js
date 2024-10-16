var Geturl = SetURL();
var PageUrl = PageUrl();

$(document).ready(function () {

    //if ($.cookie("COMPANY_NAME") != null && $.cookie("emp_Mkey") != null && $.cookie("EmpFullName") != null && $.cookie("EmpFName") != null) {
    //    window.open(PageUrl + "Task_Management/index", "_self");
    //}
    if (localStorage.chkbx && localStorage.chkbx != '') {
        $('#remember_me').attr('checked', 'checked');
        $('#username').val(localStorage.usrname);
        $('#pass').val(localStorage.pass);
    } else {
        $('#remember_me').removeAttr('checked');
        $('#username').val('');
        $('#pass').val('');
    }

    $('#remember_me').click(function () {
        if ($('#remember_me').is(':checked')) {
            // save username and password
            localStorage.usrname = $('#username').val();
            localStorage.pass = $('#pass').val();
            localStorage.chkbx = $('#remember_me').val();
        } else {
            localStorage.usrname = '';
            localStorage.pass = '';
            localStorage.chkbx = '';
        }
    });

    //$.cookie("COMPANY_NAME", r[0].COMPANY_NAME);
    //$.cookie("emp_Mkey", r[0].MKEY);
    //$.cookie("EmpFullName", r[0].EMP_FULL_NAME);
    //$.cookie("EmpFName", r[0].FIRST_NAME);
})

function phonenumber(inputtxt) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (inputtxt.match(phoneno)) {
        return true;
    }
    else
        return false;
}

function validateemailexpr(inputtxt) {
    var emialExpr = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    if (inputtxt.match(emialExpr)) {
        return true;
    }
    else
        return false;
}

function validateLogin() {
    var Url = Geturl + "Task-Management/Login?Login_ID=" + $('input[name=Username]').val() + "&Login_Password=" + $('input[name=password]').val() + "";
    console.log(Url);
    var Msg = "";
    var Flag = false;
    if ($('input[name=Username]').val().length == 0) {
        if (Msg.length == 0)
            Msg = "Email or Mobile Number is required.";
        else
            Msg = Msg + "\n" + "Email or Mobile Number is required.";
    }
    if ($('input[name=password]').val().length == 0) {
        if (Msg.length == 0)
            Msg = "Password is required.";
        else
            Msg = Msg + "\n" + "Password is required.";
    }
    if (Msg.length != 0) {
        $.notify(Msg);
        Flag = true;
    }
    if (Flag == false) {
        $('#btnProcess').css("display", "");
        $('#btnLogin').css("display", "none");
        
        $.ajax({
            url: Url,
            success: function (r) {
                if (r.length == 1) {
                    localStorage.usrname = $('input[name=Username]').val();
                    if (r[0].RESSET_FLAG.toUpperCase() == "Y") {
                        $('#pLoginUser').empty();
                        $('#pLoginUser').append(r[0].EMAIL_ID_OFFICIAL);
                        $('#hdnCurrwentPassword').val(r[0].TEMPPASSWORD);
                        $('#myModal').modal({
                            backdrop: 'static'
                        });
                    }
                    else {
                        $.cookie("COMPANY_NAME", r[0].COMPANY_NAME);
                        localStorage.emp_Mkey = r[0].MKEY;
                        //$.cookie("emp_Mkey", r[0].MKEY);
                        $.cookie("EmpFullName", r[0].EMP_FULL_NAME);
                        $.cookie("EmpFName", r[0].FIRST_NAME);
                        localStorage.Password = r[0].LOGIN_PASSWORD;
                        var CpageURL = $(location).attr("href");
                        $.cookie("CurrentPage", CpageURL);
                        window.open(PageUrl + "Details/index", "_self");
                    }
                    //window.location.href = "/Task/Add_Task";
                }
                else {
                    $.notify("Invalid credentials");
                    $('#btnProcess').css("display", "none");
                    $('#btnLogin').css("display", "");
                }
            }
        })
    }

}

function FunForgotPassword() {
    debugger;
    if ($('input[name=Username]').val().length == 0) {
        $.notify("Email or Mobile Number is required.");
    }
    else {
        $('#lgnCred').empty();
        $('#lgnCred').append($('input[name=Username]').val());
        var Url = Geturl + "Task-Management/Validate_Email?Login_ID=" + $('input[name=Username]').val() + "";
        ValidateLogin_Email_Cred(Url);

    }

}

function FunCanForgotPassword() {
    $('#dvSignIn').css("display", "inline-block");
    $('#dvForgotPassword').css("display", "none");
}

function FunSaveForgotPasword() {
    FunValidateDOB($('#hdnDOB').val());
}

function FunSaveChanges() {
    var LoginName = $('input[name=Username]').val();
    var Old_Password = $('#txtCurrentPassword').val();
    var New_Password = $('#txtNewPassword').val();

    $("input[name=txtNewPassword]").each(function () {
        var validated = true;
        if ($('#hdnCurrwentPassword').val() != $('#txtCurrentPassword').val()) {
            validated = false;
            $.notify("Invalid current password.");
        }
        if ($('#txtnewPassword').val() != this.value)
            validated = false;
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(this.value)) {
            validated = false;
        }
        if (/^[a-zA-Z\d\-_.,\s]+$/.test(this.value)) {
            validated = false;
        }
        //else
        //    validated = false;
        if (validated == false) {
            $.notify("Password does not match as per policy.");
        }
        if (validated == true) {
            var obj = {};
            obj.LoginName = $('input[name=Username]').val();
            obj.Old_Password = $('#txtCurrentPassword').val();
            obj.New_Password = $('#txtNewPassword').val();
            var url = Geturl + "Task-Management/Change_Password?LoginName=" + LoginName + "&Old_Password='" + Old_Password + "'&New_Password='" + New_Password + "'";
            $.ajax({
                type: 'GET',
                url: url,
                success: function (res) {
                    if (res == "Incorrect Old Password, Please Enter the Correct Password") {
                        $.notify(res);
                    }
                    else {
                        $('#remember_me').attr('checked', 'checked');
                        $('#username').val(localStorage.usrname);
                        $('#pass').val($('#txtNewPassword').val());
                        $.notify("Password changed Successfully.", "success");
                        $('#InputPassword1').val("");
                        $('#myModal').modal("hide");
                        if (res == "Password updated Successfully") {
                            $('#btnProcess').css("display", "none");
                            $('#btnLogin').css("display", "");
                            //$('#dvSignIn').css("display", "");
                            //$('#dvSignIn_1').css("display", "none");
                            //$('#InputPassword1').val(New_Password);
                            //Login(LoginName, New_Password);
                        }
                    }
                }
            });
        }
    });
}

function ValidateLogin_Email_Cred(Validate_Api_Url) {
    $.ajax({
        type: 'GET',
        url: Validate_Api_Url,
        success: function (data) {
            if (data.length == 0) {
                $('#dvSignIn').css("display", "inline-block");
                $('#dvForgotPassword').css("display", "none");
                $.notify("Please enter valid credentials.");
                $('#dvSignIn').css("display", "inline-block");
                $('#dvForgotPassword').css("display", "none");
                $('#InputEmail1').focus();
                $('#InputEmail1').select();
                HideProcessingForgotPassword();
            }
            else {
                $('#hdnDOB').val(data);
                $('#dvSignIn').css("display", "none");
                $('#dvForgotPassword').css("display", "inline-block");
            }
        }

    });
}

function FunValidateDOB(DOB) {
    var dd = "";
    var MM = "";
    var yyyy = "";
    var msg = "";

    var SelectDate = $('#exampleInputDOB1').val().split("-");
    dd = SelectDate[2];
    MM = SelectDate[1];
    yyyy = SelectDate[0];
    var Selected_Date_of_Bith = dd + '-' + MM + '-' + yyyy;
    if (DOB.substr(0, 10).trim() == Selected_Date_of_Bith) {
        var url = Geturl + "Task-Management/Forgot_Password?LoginName=" + $('input[name=Username]').val() + "";
        var Api_url = url;
        var obj = {};
        obj.LoginName = $('#InputEmail1').val();
        $.ajax({
            type: 'GET',
            url: Api_url,
            success: function (data) {
                var d_msg = data;
                var Details = d_msg.split("~");
                HideProcessingForgotPassword();
                if (Details[0] == "Login Name is Success") {
                    $.notify("Temporary Password has been sent to your registerd email id.");
                    $('#dvSignIn').css("display", "inline-block");
                    $('#dvForgotPassword').css("display", "none");
                }
                else {
                    HideProcessingForgotPassword();
                    $.notify("Please enter valid credentials.");
                }
            }

        });
    }
    else {
        HideProcessingForgotPassword();
        $.notify("Incorrect answer. Please Enter valid answer");
    }
}

function HideProcessingForgotPassword() {
    $('#Forgotprocessing').css("display", "none");
    $('#btnSaveForgotPassword').css("display", "");
}

function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
        validateLogin();
    }
}

