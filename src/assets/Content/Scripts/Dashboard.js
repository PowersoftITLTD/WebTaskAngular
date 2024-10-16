var app = angular.module('MyApp', []);
app.controller('DashboardController', function ($scope, $http, $window) {
    var Geturl = SetURL();
    var _PageUrl = PageUrl();

    $scope.FilrerMemberName = {};
    $scope.FilrerMemberName.MEMBER_NAME = "";
    $scope.RtpFilter = {}; "1";
    $scope.RtpFilter.Level = "1"
    localStorage.CurrentPage = "";
    $scope.ProjectOPtion = "Select";
    $scope.SubProjectOption = "Select";
    localStorage.CurrentPage = "Dashboard";
    //$scope.Sub_Project = {};
    //$scope.Sub_Project.SubProjectID = "0";
    $scope.funAplyFRilter = function (filtertype) {
        if (filtertype.Level == 0) {
            $scope.RtpFilter.Level = "";
        }
    }

    $scope.Get_Emp_list = function () {
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/TASK-DASHBOARD_DETAILS?CURRENT_EMP_MKEY=" + localStorage.emp_Mkey + "&CURR_ACTION=DEFAULT",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {

            $scope.Todays_Count = data.data["Table"]["length"];
            $scope.Overdue_Count = data.data["Table1"]["length"];
            $scope.Review_Count = data.data["Table2"]["length"];
            $scope.Allocated_but_not_statrted_Count = data.data["Table3"]["length"];
            $scope.Future_task_Count = data.data["Table4"]["length"];
            $scope.DashBaordCountRes = data.data;
        });
    };
    $scope.funchangesubproject = function () {
        alert('me');
        //$scope.Sub_Project.SubProjectID = $scope.Sub_Project_Deatils;
    }
    $scope.FunGetDetails = function () {
        console.log(Geturl + "Task-Management/Get_Project_Details?ProjectID=" + $scope.Project.MASTER_MKEY + "&SubProjectID=" + $scope.Sub_Project.SubProjectID + "");
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/Get_Project_Details?ProjectID=" + $scope.Project.MASTER_MKEY + "&SubProjectID=0",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {
            $scope.FunGetProjectwithTeamDetails(0)
            $scope.GetProjectViewDetails = data.data.Table;
        });
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

    $scope.FunGetProjectwithTeamDetails = function (TaskNumber) {
        $scope.ExportTaskNumber=TaskNumber;
        var Geturl = SetURL();
        $.ajax({
            method: 'GET',
            url: Geturl + "Task-Management/GET-TASK_TREE?TASK_MKEY=" + TaskNumber+"",
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
                    "START_DATE": data[i].START_DATE,
                    "COMPLETION_DATE": data[i].COMPLETION_DATE,
                    "CREATOR": data[i].CREATOR,
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
                    pageSize: 100
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
                        dataField: "START_DATE",
                        width: 100,
                        caption: "Start Date"
                    },
                    {
                        dataField: "COMPLETION_DATE",
                        width: 100,
                        caption: "Completion Date"
                    },
                    {
                        dataField: "CREATOR",
                        width: 100,
                        caption: "Creator"
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
                            if (options.data.STATUS_PERC < 25) {
                                container.append($("<div class='progress' style='background-color:#f0f0f5'><div class='progress-bar progress-bar-striped progress-bar-info' style='width: " + options.data.STATUS_PERC + "%;background-color:#ffbf80'><b style='color:#331a00'>" + options.data.STATUS_PERC + "%<b/>"))
                            }
                            if (options.data.STATUS_PERC >= 25 && options.data.STATUS_PERC <= 75) {
                                container.append($("<div class='progress' style='background-color:#f0f0f5'><div class='progress-bar progress-bar-striped progress-bar-info' style='width: " + options.data.STATUS_PERC + "%;background-color:#809fff'><b style='color:#331a00'>" + options.data.STATUS_PERC + "%<b/>"))
                            }
                            if (options.data.STATUS_PERC > 75) {
                                container.append($("<div class='progress' style='background-color:#f0f0f5'><div class='progress-bar progress-bar-striped progress-bar-info' style='width: " + options.data.STATUS_PERC + "%;background-color:#80ff80'><b style='color:#331a00'>" + options.data.STATUS_PERC + "%<b/>"))
                            }
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
    }

    $scope.FunExportDetails = function (TaskNumber) {

        var Geturl = SetURL();
        $.ajax({
            method: 'GET',
            url: Geturl + "Task-Management/GET-TASK_TREEExport?TASK_MKEY=" + $scope.ExportTaskNumber + "",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {
            var tasks = [];
            
           
            console.log(tasks);
        });
    }
    $scope.GetTodaysTask = function () {
        localStorage.Task = "1";
        window.location.href = _PageUrl + "Task_Management/index";
    }

    $scope.GetOverDueTask = function () {
        localStorage.Task = "2";
        window.location.href = _PageUrl + "Task_Management/index";
    }

    $scope.GetFutureTask = function () {
        localStorage.Task = "7";
        window.location.href = _PageUrl + "Task_Management/index";
    }

    $scope.GetAllocatedTask = function () {
        localStorage.Task = "GetAllocatedTask";
        window.location.href = _PageUrl + "Task_Management/index";
    }

    $scope.Get_Emp_list();

    $scope.funHomeTab = function () {
        $('#home-tab').addClass("active fuse-ripple-ready");
        $('#budget-summary-tab').removeClass("active fuse-ripple-ready");
        $('#ProjectView').removeClass("active fuse-ripple-ready");
    }

    $scope.FunTeamProgress = function () {
        $('#home-tab').removeClass("active fuse-ripple-ready");
        $('#budget-summary-tab').addClass("active fuse-ripple-ready");
        $('#ProjectView').removeClass("active fuse-ripple-ready");
    }

    $scope.FunProjectView = function () {
        $('#home-tab').removeClass("active fuse-ripple-ready");
        $('#budget-summary-tab').removeClass("active fuse-ripple-ready");
        $('#ProjectView').addClass("active fuse-ripple-ready");

       
    }
    $('#ddlSubprojectChange').change(function () {
        $scope.Sub_Project.SubProjectID = $('#ddlSubprojectChange option:selected').val()
       
    })

    $scope.FunOpenDetails = function (id) {
        $('#WorkLoadStatus').modal("show");
    }
    $scope.Get_All_Project = function () {
        
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/Get-Option?Type_Code=PROJECT&Master_mkey=" + localStorage.emp_Mkey+"",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {
            //$scope.Project = "0";
            $scope.Project_Option = data.data;
        });
    };
    $scope.Get_All_Project();
    $scope.GetTeamStatus = function () {
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/TeamTask?CURRENT_EMP_MKEY=" + localStorage.emp_Mkey + "",
            dataType: 'json',
            contentType: "application/json",
        }).then(function (data) {
            debugger;
            $scope.DetailsTable1 = data.data.Table;

        });
    }

    $scope.GetTeamStatus();

    $scope.funGetDeta = function (day, Responsible_Emp_meky, DeptType) {
        alert(day + "-" + Responsible_Emp_meky + "-" + DeptType);
        if (day == 1)
            day = "DEPT-TODAY";
        if (day == 2)
            day = "DEPT-OVERDUE";
        if (day == 3)
            day = "DEPT-FUTURE";
        if (day == 4)
            day = "INTERDEPT-TODAY";
        if (day == 5)
            day = "INTERDEPT-OVERDUE";
        if (day == 6)
            day = "INTERDEPT-FUTURE";

        localStorage.TaskType_desc = day;
        //localStorage.EMP_MKEY = localStorage.emp_Mkey
        localStorage.Responsible_Emp_meky = Responsible_Emp_meky;
        localStorage.TASKTYPE = DeptType;
        window.location.href = _PageUrl + 'TeamStatus/Index';
    }

    $scope.funDoneWork_leadeDetails = function () {
        $('#WorkLoadStatus').modal("hide");
    }
    var _Today = [];
    var _OverDue = [];
    var _Future = [];
    var _plabels = [];
    $.get(Geturl + "Task-Management/TASK-DASHBOARD_DETAILS?CURRENT_EMP_MKEY=" + localStorage.emp_Mkey + "&CURR_ACTION=%22%22", function (data, status) {
        if (data.Table5.length > 0) {
            for (var i = 0; i < data.Table5.length; i++) {
                _Today.push(data.Table5[i].Today);
                _OverDue.push(data.Table5[i].Overdue);
                _Future.push(data.Table5[i].Future);
                _plabels.push(data.Table5[i].RESPONSIBLE);
            }

            var tcount = 0;
            for (var tl = 0; tl < _Today.length; tl++) {
                if (_Today[tl] == "0") {
                    tcount++;
                }
            }
            if (_Today.length == tcount)
                _Today = [];

            var OCount = 0;
            for (var Ol = 0; tl < _OverDue.length; Ol++) {
                if (_OverDue[tl] == "0") {
                    OCount++;
                }
            }
            if (_OverDue.length == OCount)
                _OverDue = [];
            var Fcount = 0;
            for (var Fl = 0; Fl < _Future.length; Fl++) {
                if (_OverDue[tl] == "0") {
                    Fcount++;
                }
            }
            if (_Future.length == Fcount)
                _Future = [];


            var d = [{
                type: 'stackedBar',
                title: 'Today',
                data: _Today,
                fillStyles: ['#03a9f4'],
                labels: { fillStyle: '#ffffff', font: '20px sans-serif' },
            },
            {
                type: 'stackedBar',
                title: 'Overdue',
                data: _OverDue,
                fillStyles: ['#ff9800'],
                labels: { fillStyle: '#ffffff', font: '20px sans-serif' },

            },
            {
                type: 'stackedBar',
                title: 'Future',
                data: _Future,
                fillStyles: ['#f44336'],
                labels: { fillStyle: '#ffffff', font: '20px sans-serif' },
            }];
        }
        $('#jqChart').jqChart({
            title: { text: '' },
            axes: [
                {
                    type: 'category',
                    location: 'left',
                    categories: _plabels,
                    labels: { fillStyle: '#003487', font: '20px sans-serif' },

                }
            ],
            series: d,
        });
    });
})