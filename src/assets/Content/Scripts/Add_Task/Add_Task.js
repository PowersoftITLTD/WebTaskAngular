var app = angular.module('MyApp', []);
app.controller('testController', function ($scope, $http, $window) {
    var Geturl = SetURL();

    //    var PageUrl = PageUrl();
    $scope.Project = "0";
    $scope.IsModifyMode = false;
    $scope.CategorySelect = "Select";
    $scope.ProjectOPtion = "Select";
    $scope.SubProjectOption = "Select";
    $scope.AddigndTo = "Select";
    $scope.IsAddSubTask = false;
    $scope.ngCategory = false;
    $scope.disabled_Progress = false;
    $scope.DisabledCategory = false;
    $scope.Task = {};
    $scope.Task.Task_Name = "";
    $scope.Task.Task_Desc = "";
    $scope.Task.Progress = "";
    $scope.Task.ActionRemarks = "";
    $scope.Progress = "";
    $scope.ActionRemarks = "";
    $scope.Employee_Deatils = {};
    //$scope.CssnavTaskInfo = "nav-link btn active";
    //$scope.CssnavActionable = "nav-link btn";
    //$scope.CssnavProgress_Details = "nav-link btn";
    //$scope.CssnavIssues_Faced = "nav-link btn";
    $scope.btnSaveDisabled = false;
    $('#tblHistory').DataTable({
        "columns": [
            { "width": "15%" },
            { "width": "10%" },
            { "width": "10%" },
            { "width": "45%" },
            { "width": "20%" }
        ],
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false
    });

    //$scope.CssnavTaskInfo = "nav-link btn active";
    //$scope.CssnavActionable = "nav-link btn";
    //$scope.CssnavProgress_Details = "nav-link btn";
    //$scope.CssnavIssues_Faced = "nav-link btn";

    $scope.TaskINfo_Dis = function (CreatedBy, Login_Emp_Mkey) {
        if ($scope.IsModifyMode == true) {
            if (CreatedBy != Login_Emp_Mkey) {
                $scope.DisabledCategory = true;
                $scope.IsEnabled = true;
                $scope.ngCategory = true;
            }
            else {
                $scope.DisabledCategory = true;
                $scope.IsEnabled = false;
                $scope.ngCategory = false;
            }
        }
    }

    $scope.TaskInfo = function () {
        $('#basic-info-tab-pane').css("display", "");
        $('#ProgressTab').css("display", "");
        $('#basic-info-tab').addClass("active");
        $('#product-images-tab').removeClass("active");

        $scope.CssnavTaskInfo = "nav-link btn active";
        $scope.CssnavActionable = "nav-link btn";
        $scope.CssnavProgress_Details = "nav-link btn";
        $scope.CssnavIssues_Faced = "nav-link btn";
        if ($scope.IsModifyMode == true) {
            var t = false;
            if ($scope.Task.STATUS === "CANCEL")
                t = true;
            if ($scope.Task.STATUS === "COMPLETED")
                t = true;
            if (t == false) {

                if ($scope.TASK_CREATED_BY == localStorage.emp_Mkey) {
                    $scope.DispSaveTask = { "display": "" };
                }
                else
                    $scope.DispSaveTask = { "display": "none" };
            }

        }
        //alert($scope.TASK_CREATED_BY);
    };

    $scope.Actionable = function () {
        $('#basic-info-tab-pane').css("display", "");
        $('#ProgressTab').css("display", "");
        $scope.CssnavTaskInfo = "nav-link btn ";
        $scope.CssnavActionable = "nav-link btn active";
        $scope.CssnavProgress_Details = "nav-link btn";
        $scope.CssnavIssues_Faced = "nav-link btn";

        $scope.GET_ACTIONS();
    }

    $scope.Progress_Details = function () {
        $scope.CssnavTaskInfo = "nav-link btn";
        $scope.CssnavActionable = "nav-link btn";
        $scope.CssnavProgress_Details = "nav-link btn active";
        $scope.CssnavIssues_Faced = "nav-link btn";
        $('#basic-info-tab-pane').css("display", "none");
        $('#ProgressTab').css("display", "none");
        $('#_PDetails').css("display", "");
    }

    $scope.Issues_Faced = function () {

        $scope.CssnavTaskInfo = "nav-link btn ";
        $scope.CssnavActionable = "nav-link btn";
        $scope.CssnavProgress_Details = "nav-link btn";
        $scope.CssnavIssues_Faced = "nav-link btn active";


        $('#basic-info-tab-pane').css("display", "none");
        $('#ProgressTab').css("display", "none");

        $('#_PDetails').css("display", "none");
        //$('#basic-info-tab-pane').css("display", "none");
        //$('#ProgressTab').css("display", "none");
        //$scope.CssnavTaskInfo = "nav-link btn ";

    }

    $scope.SaveActionable = function () {
        var Msg = "";
        var Flag = false;
        if ($scope.Task.Progress.length == 0) {
            if (Msg.length == 0)
                Msg = "Progress is required.";
            else
                Msg = Msg + "\n" + "Progress is required.";
        }
        if ($scope.Task.Progress > 0) {

            if ($scope.Task.Progress > 100) {
                if (Msg.length == 0)
                    Msg = "Progress should be less than  or equal to 100.";
                else
                    Msg = Msg + "\n" + "Progress should be less than  or equal to 100.";
            }
        }
        if ($scope.Task.ActionRemarks.length == 0) {
            if (Msg.length == 0)
                Msg = "Remarks is required.";
            else
                Msg = Msg + "\n" + "Remarks is required.";
        }

        if (Msg.length != 0) {
            $.notify(Msg);
            Flag = true;
        }
        return Flag;
        //Task_Desc
        //ComDate
        //AssTo
    }

    $scope.ProgressStatusChange = function () {

        if ($scope.DdlProStatus.TYPE_DESC.toString().toUpperCase() == "CLOSE INITIATED") {
            $scope.Task.Progress = 100;
            $('#txtProgress').val(100);
            $('#txtProgress').focus();
            $scope.disabled_Progress = true;
        }
        else {
            $scope.Task.Progress = "";
            $scope.disabled_Progress = false;
        }

    }

    $scope.GET_ACTIONS = function () {
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/GET-ACTIONS?TASK_MKEY=" + $scope.Task.Current_task_mkey + "&CURRENT_EMP_MKEY=" + localStorage.emp_Mkey + "&CURR_ACTION=" + $scope.Task.STATUS + "",
            dataType: 'json',
            contentType: "application/json",
            async: false
        }).then(function (data) {
            $scope.ProgressStatus = data.data.Table;
            $scope.DdlProStatus = data.data.Table[0];
            var favourit = [];
            var table = $('#tblHistory').DataTable();
            table.clear().draw();
            table.columns.adjust().draw();
            for (var i = 0; i < data.data.Table1.length; i++) {
                var File_Path = "";
                if (data.data.Table1[i].FILE_PATH.length > 0) {
                    File_Path = '<a href="' + data.data.Table1[i].FILE_PATH + '" target="_blank"><i class="fa fa-download" aria-hidden="true"></i>"' + data.data.Table1[i].FILE_NAME + '"</a> ';
                }
                else
                    File_Path = "";
                table.row.add($(
                    '<tr>' +
                    '<td>' + data.data.Table1[i].CREATION_DATE + '</td>' +
                    '<td style="text-align:center">' + data.data.Table1[i].PROGRESS_PERC + '</td>' +
                    '<td>' + data.data.Table1[i].STATUS + '</td>' +
                    '<td>' + data.data.Table1[i].COMMENT + '</td>' +
                    '<td>' + File_Path + '</td>' +
                    '</tr>'
                )).draw(false);
            }
            $('.dataTables_length').css("display", "none");
            $('.dataTables_info').css("display", "none");

            //GetDetails($scope.Task.Current_task_mkey)
            //$('.dataTables_paginate paging_simple_numbers').css("display", "none");
            //
            //$scope.ProgressDetails = data.data.Table1;
        });
    };

    $scope.GetCategory = function (Master_Mkey) {
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/Get-Option?Type_Code=Category&Master_mkey=0",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].MASTER_MKEY == Master_Mkey)
                    $scope.Category = data.data[i];
            }
            if (Master_Mkey == 0)
                $scope.Category = data.data[0];

            $scope.CategoryOption = data.data;
        });
    };

    $scope.Get_All_Project = function () {
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/Get-Option?Type_Code=PROJECT&Master_mkey=0",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {
            //$scope.Project = "0";
            $scope.Project_Option = data.data;
        });
    };

    $scope.ChngCategory = function () {

        var Ct = $scope.Category;
        if (Ct.TYPE_DESC == "PRIVATE") {
            $scope.ngCategory = true;
            $('#myInput').val($.cookie("EmpFullName"));
            $scope.Employee_Deatils.MKEY = localStorage.emp_Mkey;
        }
        else
            $scope.ngCategory = false;
    }

    $scope.GetSubProject = function () {
        //Task-Management/Get-Sub_Project
        console.log(Geturl + "Task-Management/Get-Sub_Project?Project_Mkey=" + $scope.Project.MASTER_MKEY + "");
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/Get-Sub_Project?Project_Mkey=" + $scope.Project.MASTER_MKEY + "",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {
            $scope.Sub_Project = data.data;
        });

    };

    $scope.Get_Emp_list = function () {
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/Get-Emp?CURRENT_EMP_MKEY=" + localStorage.emp_Mkey + "&FILTER=DEFAULT",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {
            //$scope.Employee_Deatils =
            for (var i = 0; i < data.data.length; i++) {

                if (data.data[0].MKEY == localStorage.emp_Mkey) {
                    $scope.Employee_Deatils = data.data[i];
                    //$('#myInput').val(data.data[i].EMP_FULL_NAME);
                }
                //      if (data.data[i])
            }
            $scope.Employee_List = data.data;
        });
    };

    $scope.AddTask = function () {

        $scope.Task_Number = $scope.Task.TASK_NO;
        if ($scope.Task.Task_Name.length > 50)
            $scope.Task_Name = $scope.Task.Task_Name.substring(0, 50) + ".....";
        else
            $scope.Task_Name = $scope.Task.Task_Name;
        if ($scope.Task.Task_Desc.length > 50) {
            $scope.FullTaskDesc = $scope.Task.Task_Desc;
            $scope.Task_description = $scope.Task.Task_Desc.substring(0, 50) + "....";
        }
        else {
            $scope.FullTaskDesc = $scope.Task.Task_Desc;
            $scope.Task_description = $scope.Task.Task_Desc;
        }
        $scope.Completion_Date = $scope.Task.Completion_Date;

        $scope.IsAddSubTask = true;
        $scope.DispSaveTask = { "display": "" };
        //$('#btnAddSubtask').css("display", "none");
        $scope.DispAddSubtask = { "display": "none" };
        $('#TaskInfocustom_file').css("display", "");
        $('#dvAtchment').css("display", "none");


        $('#AttachmentDetails').empty();
        $('#AttachmentDetails').text("Attachment if any:");
        $scope.DisabledCategory = false;
        $scope.IsEnabled = false;
        $scope.ngCategory = false;

        $scope.DownFileName = "Attachment if any:";

        $('#myInput').val("");
        $('#basic-info-tab').removeClass("nav-link btn").addClass("nav-link btn active");
        $('#product-images-tab').removeClass("nav-link btn active").addClass("nav-link btn");
        $('#basic-info-tab-pane').removeClass("tab-pane fade show ").addClass("tab-pane fade show active");
        $('#ProgressTab').removeClass("tab-pane fade show active").addClass("tab-pane fade");

        $('#lnkProgress_Details').removeClass("nav-link btn active").addClass("nav-link btn");
        $('#_PDetails').removeClass("tab-pane fade show active").addClass("tab-pane fade show ");
        $('#basic-info-tab-pane').css("display", "");
        $('#ProgressTab').css("display", "");
        $('#basic-info-tab').addClass("active");
        $('#product-images-tab').removeClass("active");
        $scope.DisabledCategory = true;
        //$scope.DispTab =
        //    { "display": "none" };

        $('#lActionable').css("display", "none");
        $('#lProgress_Details').css("display", "none");
        $('#lIssues_Faced').css("display", "none");

    };

    $scope.RemoveAttch = function () {
        $('#AttachmentDetails').empty();
        $('#dvAtchment').css("display", "none");
        $('#TaskInfocustom_file').css("display", "");

    }

    $scope.SetByDefaultTextOnPageLoad = function () {
        $scope.Task_Number = $scope.Task.TASK_NO;
        if ($scope.Task.Task_Name.length > 50)
            $scope.Task_Name = $scope.Task.Task_Name.substring(0, 50) + ".....";
        else
            $scope.Task_Name = $scope.Task.Task_Name;
        $scope.FullTaskDesc = $scope.Task.Task_Desc;
        if ($scope.Task.Task_Desc.length > 50)
            $scope.Task_description = $scope.Task.Task_Desc.substring(0, 50) + "....";
        else
            $scope.Task_description = $scope.Task.Task_Desc;
        $scope.Completion_Date = $scope.Task.Completion_Date;
    }

    $scope.get_task_Task_by_Task_ID = function (Task_Num) {
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/TASK-DETAILS_BY_MKEY?Mkey=" + Task_Num + "",
            dataType: 'json',
            contentType: "application/json",
            async: false
        }).then(function (data) {

            //$scope.Category = "65";
            $scope.CategoryOption = data.data;
            $scope.Task = {};
            $scope.GetCategory(data.data[0].CATEGORY_MKEY);
            $scope.Get_All_Project();
            $scope.Task.Current_task_mkey = data.data[0].MKEY;
            $scope.Task.Task_Name = data.data[0].TASK_NAME;
            $scope.Task.Task_Desc = data.data[0].TASK_DESCRIPTION;
            $scope.Task.TASK_NO = data.data[0].TASK_NO;
            $scope.Task.ISNODE = data.data[0].ISNODE;
            $scope.Task.TASK_PARENT_ID = data.data[0].TASK_PARENT_ID;
            $scope.Task.TASK_MAIN_NODE_ID = data.data[0].TASK_MAIN_NODE_ID;
            $scope.Task.STATUS = data.data[0].STATUS;
            $scope.Task.Completion_Date = data.data[0].COMPLETION_DATE;
            $scope.ActualCmpDate = data.data[0].COMPLETION_DATE;
            console.log(data.data[0].COMPLETION_DATE);
            $scope.Category_Mkey = data.data[0].CATEGORY_MKEY;
            $scope.CategorySelect = data.data[0].CAREGORY;
            $scope.Project = {};
            $scope.ProjectOPtion = data.data[0].PROJECT;
            $scope.Project.MASTER_MKEY = data.data[0].PROJECT_MKEY;
            $scope.GetSubProject($scope.Project.MASTER_MKEY);
            $scope.SubProjectOption = data.data[0].Sub_PROJECT;
            $scope.Task.Progress = "";
            $scope.Task.ActionRemarks = "";
            $('#AttachmentDetails').empty();
            $('#AttachmentDetails').append(data.data[0].FILE_NAME);
            $('#TaskInfocustom_file').css("display", "none");

            if (data.data[0].FILE_PATH.length > 1)
                $('#dvAtchment').css("display", "");
            else {
                $('#dvAtchment').css("display", "none");
                $('#TaskInfocustom_file').css("display", "");
            }

            $scope.DownFileName = data.data[0].FILE_NAME;
            $('#DownAttchment').attr("href", data.data[0].FILE_PATH);
            $scope.AddigndTo = data.data[0].EMP_FULL_NAME;
            $('#myInput').val(data.data[0].EMP_FULL_NAME);
            $('#tagsforAssign').tagsinput('add', data.data[0].TAGS);
            //$scope.nTags = data.data[0].TAGS;
            //$('#tagsforAssign').val(data.data[0].TAGS);
            //$('#tagsforAssign').tagsinput('destroy');
            //$('#tagsforAssign').tagsinput();
            //$('#tagsforAssign').tagsinput('refresh');


            if (localStorage.emp_Mkey == data.data[0].RESPOSIBLE_EMP_MKEY) {//&& data.data[0].ISNODE == 'N') {
                $scope.DispTakeAction = { "display": "" };
                //$('#TakeAction').css("display", "");
            }
            else {
                $scope.DispTakeAction = { "display": "none" };
                //$('#TakeAction').css("display", "none");
                $scope.DispAddSubtask = { "display": "none" };
                //$('#btnAddSubtask').css("display", "none");

            }
            $scope.DispSaveTask = { "display": "none" };
            $scope.SetByDefaultTextOnPageLoad();


            $('#basic-info-tab').removeClass("nav-link btn active").addClass("nav-link btn");
            $('#product-images-tab').addClass("nav-link btn active");
            $('#basic-info-tab-pane').removeClass("tab-pane fade show active").addClass("tab-pane fade show ");
            $('#ProgressTab').removeClass("tab-pane fade").addClass("tab-pane fade show active");

            if (data.data[0].STATUS == "CANCEL" || data.data[0].STATUS == "COMPLETED") {
                $scope.DispTakeAction = { "display": "none" };
                $scope.DispAddSubtask = { "display": "none" };
                $scope.DispSaveTask = { "display": "none" };
            }
            $scope.Actionable();
            var Geturl = SetURL();
            $.ajax({
                method: 'GET',
                url: Geturl + "Task-Management/GET-TASK_TREE?TASK_MKEY=" + data.data[0].MKEY + "",
                dataType: 'json',
                contentType: "application/json",
            }).then(function (data) {
                var tasks = [];
                for (var i = 0; i < data.length; i++) {

                    tasks.push({
                        "Task_ID": data[i].MKEY,
                        "Task_Owner_ID": data[i].ASSIGNED_TO,
                        "TASK_NO": data[i].TASK_NO,
                        "Task_Name": data[i].TASK_NAME,
                        "TASK_DESCRIPTION": data[i].TASK_DESCRIPTION,
                        "COMPLETION_DATE": data[i].COMPLETION_DATE,
                        "STATUS": data[i].STATUS,
                        "STATUS_PERC": data[i].STATUS_PERC,
                        "RESPONSIBLE": data[i].RESPONSIBLE,
                        "ACTIONABLE": data[i].ACTIONABLE,
                        "Task_Parent_ID": data[i].TASK_PARENT_ID
                    });
                }
                $("#tasks").dxTreeList({
                    dataSource: tasks,
                    keyExpr: "Task_ID",
                    parentIdExpr: "Task_Parent_ID",
                    autoExpandAll: true,
                    columnAutoWidth: false,
                    showBorders: true,
                    scrolling: {
                        mode: "standard"
                    },
                    paging: {
                        enabled: true,
                        pageSize: 10
                    },
                    pager: {
                        showPageSizeSelector: true,
                        allowedPageSizes: [5, 10, 20],
                        showInfo: true
                    },
                    columns: [
                        {
                            dataField: "TASK_NO",
                            width: 150,
                            caption: "Task No"
                            //cellTemplate: function (container, options) {
                            //    container.append($("<div>", { "class": "spinner-grow  spinner-grow-sm text-primary" }));
                            //}
                        },
                        {
                            dataField: "Task_Name",
                            width: 200,
                            caption: "Task Name"
                        },
                        {
                            dataField: "TASK_DESCRIPTION",
                            width: 250,
                            caption: "Task Desc"
                        },
                        {
                            dataField: "COMPLETION_DATE",
                            width: 100,
                            caption: "Completion Date"
                        },
                        {
                            dataField: "RESPONSIBLE",
                            width: 100,
                            caption: "Responsible"
                        }
                        ,
                        {
                            dataField: "STATUS_PERC",
                            width: 100,
                            caption: "Status Perc",
                            cellTemplate: function (container, options) {
                                debugger;
                                if (options.data.STATUS_PERC < 25) {
                                    container.append($("<div class='progress' style='background-color:#f0f0f5'><div class='progress-bar progress-bar-striped progress-bar-info' style='width: " + options.data.STATUS_PERC + "%;background-color:#ffbf80'><b style='color:#331a00'>" + options.data.STATUS_PERC + "%<b/>"))
                                }
                                if (options.data.STATUS_PERC >= 25 && options.data.STATUS_PERC <= 75) {
                                    container.append($("<div class='progress' style='background-color:#f0f0f5'><div class='progress-bar progress-bar-striped progress-bar-info' style='width: " + options.data.STATUS_PERC + "%;background-color:#809fff'><b style='color:#331a00'>" + options.data.STATUS_PERC + "%<b/>"))
                                }
                                if (options.data.STATUS_PERC > 75) {
                                    container.append($("<div class='progress' style='background-color:#f0f0f5'><div class='progress-bar progress-bar-striped progress-bar-info' style='width: " + options.data.STATUS_PERC + "%;background-color:#80ff80'><b style='color:#331a00'>" + options.data.STATUS_PERC + "%<b/>"))
                                }

                                //    .append($("<span>", { "class": "", style: "background-color:red;width:" + options.data.STATUS_PERC + "" }))
                                //       .append($("<span>", { "class": "", text: options.data.STATUS_PERC }));
                                //}
                            }
                        }
                        ,
                        {
                            dataField: "STATUS",
                            width: 130,
                            caption: "Status"

                        }
                        ,
                        {
                            dataField: "ACTIONABLE",
                            width: 100,
                            caption: "Actionable"
                        }

                    ]
                });
                console.log(tasks);
            });
            $scope.TASK_CREATED_BY = data.data[0].TASK_CREATED_BY;
            $scope.TaskINfo_Dis(data.data[0].TASK_CREATED_BY, localStorage.emp_Mkey);
            $scope.Task.Progress = data.data[0].STATUS_PERC;
            $('#txtProgress').focus();


            //var citynames = new Bloodhound({
            //    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            //    queryTokenizer: Bloodhound.tokenizers.whitespace,
            //    prefetch: {
            //        url: Geturl + 'Task-Management/EMP_TAGS?EMP_TAGS=' + localStorage.emp_Mkey + '',
            //        filter: function (list) {
            //            return $.map(list, function (cityname) {
            //                return { name: cityname };
            //            });
            //        }
            //    }
            //});
            //citynames.initialize();

            //$('#tagsforAssign').tagsinput({
            //    typeaheadjs: {
            //        name: 'citynames',
            //        displayKey: 'name',
            //        valueKey: 'name',
            //        source: citynames.ttAdapter()
            //    }
            //});
        });
    };
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    /* Define functin to find and replace specified term with replacement string */
    function replaceAll(str, term, replacement) {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
    }
    $scope.SaveValidation = function () {
        var Flag = false;
        var Msg = "";
        if ($scope.Task.Task_Name.length == 0) {
            if (Msg.length == 0)
                Msg = "Task Name is required.";
            else
                Msg = Msg + "\n" + "Task Name is required.";
        }
        if ($scope.Task.Task_Desc.length == 0) {
            if (Msg.length == 0)
                Msg = "Task Desc is required.";
            else
                Msg = Msg + "\n" + "Task Desc is required.";
        }
        if ($('#myInput').val().length == 0) {
            if (Msg.length == 0)
                Msg = "Assigned To is required.";
            else
                Msg = Msg + "\n" + "Assigned To is required.";
        }
        if ($('#txt_Completion_Date').val().length == 0) {
            if (Msg.length == 0)
                Msg = "Completion Date is required.";
            else
                Msg = Msg + "\n" + "Completion Date is required.";
        }

        var ActualCompleteDate = Date.parse($scope.ActualCmpDate);
        var currentCompleteDate = Date.parse($scope.Task.Completion_Date);
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        if (ActualCompleteDate < currentCompleteDate) {
            if (Msg.length == 0)
                Msg = "Completion Date can't be greater then " + $scope.ActualCmpDate + ".";
            else
                Msg = Msg + "\n" + "Completion Date can't be greater then " + $scope.ActualCmpDate + ".";

        }
        if (currentCompleteDate < Date.parse(date)) {
            if (Msg.length == 0)
                Msg = "Completion Date can't be past Date.";
            else
                Msg = Msg + "\n" + "Completion Date can't be past Date.";
        }

        if (Msg.length != 0) {
            $.notify(Msg);
            Flag = true;
        }
        return Flag;
        //Task_Desc
        //ComDate
        //AssTo

    }

    $scope.Save = function () {
        debugger;
        if ($scope.SaveValidation() == false) {

            $scope.btnSaveDisabled = true;
            var Sub_Project_ID = 0;
            var Project_ID = 0;
            var SetURL = "";

            if ($scope.Project.MASTER_MKEY != undefined) {

                Project_ID = $scope.Project.MASTER_MKEY;
            }

            if ($scope.Sub_Project_Deatils != undefined) {

                Sub_Project_ID = $scope.Sub_Project_Deatils.MASTER_MKEY;
            }
            var _Name = $scope.Task.Task_Name;
            _Name = replaceAll(_Name, "&", "%26");
            $scope.Task.Task_Name = _Name;
            var _Desc = $scope.Task.Task_Desc;
            _Desc = replaceAll(_Desc, "&", "%26");
            $scope.Task.Task_Desc = _Desc;
            var TaskNo = "";
            var formData = new FormData();
            var Flag = $scope.IsAddSubTask;
            var opmlFile;
            if (Flag == true) {
                opmlFile = $('#customFile')[0];
                console.log(opmlFile);
                formData.append("opmlFile", opmlFile.files[0]);
                SetURL = "?TASK_NO=" + $scope.Task.Current_task_mkey + "&TASK_NAME=" + $scope.Task.Task_Name + "&TASK_DESCRIPTION=" + $scope.Task.Task_Desc + "&CATEGORY=" + $scope.Category.MKEY + "";
                SetURL = SetURL + "&PROJECT_ID=" + Project_ID + "";
                SetURL = SetURL + "&SUBPROJECT_ID=" + Sub_Project_ID + "&COMPLETION_DATE=" + $scope.Task.Completion_Date + "";
                SetURL = SetURL + "&ASSIGNED_TO=" + $('#myInput').val() + "&TAGS=" + $("#tagsforAssign").tagsinput('items') + "";
                SetURL = SetURL + "&ISNODE=N&START_DATE=&CLOSE_DATE=&DUE_DATE=&TASK_PARENT_ID=" + $scope.Task.Current_task_mkey + "&TASK_PARENT_NODE_ID=" + $scope.Task.TASK_MAIN_NODE_ID + "&TASK_PARENT_NUMBER=" + $scope.Task.TASK_NO + "&STATUS=WIP&STATUS_PERC=0&TASK_CREATED_BY=" + localStorage.emp_Mkey + "";
                SetURL = SetURL + "&APPROVER_ID=1&IS_ARCHIVE=&ATTRIBUTE1=&ATTRIBUTE2=&ATTRIBUTE3=&ATTRIBUTE4=&ATTRIBUTE5=&CREATED_BY=" + localStorage.emp_Mkey + "";
                SetURL = SetURL + "&CREATION_DATE=&LAST_UPDATED_BY=" + localStorage.emp_Mkey + "&APPROVE_ACTION_DATE=&Current_task_mkey=" + $scope.Task.Current_task_mkey + "";
                console.log(Geturl + "Task-Management/Add-Sub-Task" + SetURL + "");
                $http({
                    url: Geturl + "Task-Management/Add-Sub-Task" + SetURL + "",
                    async: false
                }).then(function (data) {
                    TaskNo = data.data[0].TASK_NO;
                    formData.append("Mkey", data.data[0].Mkey);
                    formData.append("CREATED_BY", localStorage.emp_Mkey);
                    formData.append("DELETE_FLAG", "N");
                    formData.append("TASK_PARENT_ID", data.data[0].TASK_PARENT_ID);
                    formData.append("TASK_MAIN_NODE_ID", data.data[0].TASK_MAIN_NODE_ID);

                    if (opmlFile.files[0] != undefined) {
                        $.ajax({
                            url: Geturl + 'Task-Management/FileUpload',
                            type: 'POST',
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false
                        });
                    }
                    $scope.Employee_List = data.data;
                    $.notify("Your Task saved successfully with Task No : " + TaskNo + "", "success");
                    setTimeout(
                        function () {
                            var _PageUrl = PageUrl();
                            window.location.href = _PageUrl + "Task_Management/index";
                        }, 1000);
                });


            }
            else {
                formData = new FormData();
                opmlFile = $('#customFile')[0];
                console.log(opmlFile);
                formData.append("opmlFile", opmlFile.files[0]);
                SetURL = "?TASK_NO=" + $scope.Task.Current_task_mkey + "&TASK_NAME=" + $scope.Task.Task_Name + "&TASK_DESCRIPTION=" + $scope.Task.Task_Desc + "&CATEGORY=" + $scope.Category.MKEY + "";
                SetURL = SetURL + "&PROJECT_ID=" + Project_ID + "";
                SetURL = SetURL + "&SUBPROJECT_ID=" + Sub_Project_ID + "&COMPLETION_DATE=" + $scope.Task.Completion_Date + "";
                SetURL = SetURL + "&ASSIGNED_TO=" + $('#myInput').val() + "&TAGS=" + $("#tagsforAssign").tagsinput('items') + "";
                SetURL = SetURL + "&ISNODE=N&START_DATE=&CLOSE_DATE=&DUE_DATE=&TASK_PARENT_ID=&STATUS=WIP&STATUS_PERC=0&TASK_CREATED_BY=" + localStorage.emp_Mkey + "";
                SetURL = SetURL + "&APPROVER_ID=1&IS_ARCHIVE=&ATTRIBUTE1=&ATTRIBUTE2=&ATTRIBUTE3=&ATTRIBUTE4=&ATTRIBUTE5=&CREATED_BY=" + localStorage.emp_Mkey + "";
                SetURL = SetURL + "&CREATION_DATE=&LAST_UPDATED_BY=" + localStorage.emp_Mkey + "&APPROVE_ACTION_DATE=";
                console.log(Geturl + "Task-Management/Add-Task" + SetURL + "");
                $http({
                    url: Geturl + "Task-Management/Add-Task" + SetURL + "",
                    async: false
                }).then(function (data) {
                    TaskNo = data.data[0].TASK_NO;
                    $scope.TASK_PARENT_ID = data.data[0].TASK_PARENT_ID;
                    $scope.TASK_MAIN_NODE_ID = data.data[0].TASK_MAIN_NODE_ID;
                    $scope.Task_Mkey = data.data[0].Mkey;
                    formData.append("Mkey", data.data[0].Mkey);
                    formData.append("CREATED_BY", localStorage.emp_Mkey);
                    if ($('#AttachmentDetails').text().length > 0)
                        formData.append("DELETE_FLAG", "Y");
                    else
                        formData.append("DELETE_FLAG", "N");
                    formData.append("TASK_PARENT_ID", data.data[0].TASK_PARENT_ID);
                    formData.append("TASK_MAIN_NODE_ID", data.data[0].TASK_MAIN_NODE_ID);
                    // if (opmlFile.files[0] != undefined) {
                    $.ajax({
                        url: Geturl + 'Task-Management/FileUpload',
                        type: 'POST',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                    $scope.Employee_List = data.data;

                    //   }
                    $.notify("Your Task saved successfully with Task No : " + TaskNo + "", "success");
                    setTimeout(
                        function () {
                            var _PageUrl = PageUrl();
                            window.location.href = _PageUrl + "Task_Management/index";
                        }, 1000);

                });
            }


        }
    };

    var Task_Mkey = window.location.search.substring(1);
    if (Task_Mkey.length > 0) {
        var task_details = Task_Mkey.split("=");
        $scope.IsModifyMode = true;
        $scope.get_task_Task_by_Task_ID(task_details[1]);
        $scope.DispTab =
            { "display": "" };

    }
    else {
        $scope.Task.Current_task_mkey = "0000";
        $scope.IsModifyMode = false;
        $scope.GetCategory(0);
        $scope.Get_All_Project();
        $scope.DispTab = { "display": "none" };
    }

    $scope.Save_TASK_ACTION_TRL = function () {
        if ($scope.SaveActionable() == false) {

            var ProStatus = $scope.DdlProStatus;
            var formData = new FormData();
            var opmlFile;
            opmlFile = $('#TaskProgressFile')[0];
            formData.append("Mkey", $scope.Task.Current_task_mkey);
            formData.append("TASK_MKEY", $scope.Task.Current_task_mkey);
            formData.append("TASK_PARENT_ID", $scope.Task.TASK_PARENT_ID);
            formData.append("ACTION_TYPE", "Progress");
            formData.append("DESCRIPTION_COMMENT", $scope.Task.ActionRemarks);
            formData.append("PROGRESS_PERC", $scope.Task.Progress);
            formData.append("STATUS", ProStatus.TYPE_DESC);
            formData.append("CREATED_BY", localStorage.emp_Mkey);
            formData.append("TASK_MAIN_NODE_ID", $scope.Task.TASK_MAIN_NODE_ID);
            formData.append("FILENAME", opmlFile.files[0]);
            // formData.append("FILEPATH", opmlFile.files[0]);
            $.ajax({
                url: Geturl + 'Task-Management/TASK-ACTION-TRL-Insert-Update',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function () {
                    $.notify("Progress updated successfully.", "success");
                    $scope.Actionable();
                    $scope.Task.Progress = "";
                    $scope.Task.ActionRemarks = "";
                    setTimeout(
                        function () {
                            var _PageUrl = PageUrl();
                            window.location.href = _PageUrl + "Task_Management/index";
                        }, 500);
                }
            });
        }
    }


    //$scope.Get_All_Project();
    $scope.Get_Emp_list();

    $scope.TaskInfo();

    $scope.ShowTaskDesc = function (taskDesc) {

        $scope.FullTaskDesc = taskDesc;
    }

    $('#customFile').change(function () {
        var i = $(this).prev('label').clone();
        var file = $('#customFile')[0].files[0].name;
        $('#AttachmentDetails').empty();
        $('#AttachmentDetails').append(file);
        //$(this).prev('label').text(file);
    });


    $('#TaskProgressFile').change(function () {
        var i = $(this).prev('label').clone();
        var file = $('#TaskProgressFile')[0].files[0].name;
        $('#TaskAttachmentDetails').empty();
        $('#TaskAttachmentDetails').append(file);
        //$(this).prev('label').text(file);
    });

    function convertDate(str) {

        var parts = str.split("/");
        return new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
    }
});
/*
$(document).ready(function () {
    $("#txtCountry").autocomplete({
        source: function (request, responce) {
            var Geturl = SetURL();
            $.ajax({
                method: 'GET',
                url: Geturl + "Task-Management/Get-Emp?CURRENT_EMP_MKEY=" + $.cookie("emp_Mkey") + "&FILTER=DEFAULT",
                dataType: 'json',
                contentType: "application/json",
            }).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    countries.push(data[i].EMP_FULL_NAME);
                    if (data[i].EMP_CODE == $('#hdnEmp_Code').val()) {
                        $('#myInput').val(data[i].EMP_FULL_NAME);
                        $('#hdnEmpFullName').val(data[i].EMP_FULL_NAME);
                    }
                }
            });
        }
    });
});

*/
$(document).ready(function () {
    var Geturl = SetURL();
    $("#myInput").autocomplete({
        source: function (request, responce) {
            $.ajax({
                url: Geturl + "Task-Management/Assigned_To?AssignNameLike=" + $("#myInput").val() + "",
                method: "GET",
                contentType: "application/json;charset=utf-8",
                //data: JSON.stringify({ AssignNameLike: request.term }),
                dataType: 'json',
                success: function (data) {
                    responce(data);
                    $('#ui-id-1').css("z-index", "110000")
                },
                error: function (err) {
                    alert(err);
                }
            });
        }
    });
});  