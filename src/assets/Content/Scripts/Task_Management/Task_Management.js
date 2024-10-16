var app = angular.module('MyApp', []);
app.controller('Task_Mngmt', function ($scope, $http, $window) {
    var Geturl = SetURL();
    var AMonth;
    var ADays;

    localStorage.CurrentPage = "";
    localStorage.CurrentPage = "TaskManagement";

    $scope.StlAllTask = {
        "background-color": "#2196F3",
        "color": "#fff"
    };
    $scope.OrderBy = "Asc";

    $scope.isReadMsg = function (index) {
        $('#dvMain_' + index + '').addClass("completed");
        //todo-item pr-2 py-4 ripple row no-gutters flex-wrap flex-sm-nowrap align-items-center completed
    };

    $scope.highlight = function () {
        //if (!search) {
        //    return $sce.trustAsHtml(text);
        //}
        //return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };

    $scope.Get_Task_Details = function (FilterType) {
        //
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/TASK-DASHBOARD?CURRENT_EMP_MKEY=" + localStorage.emp_Mkey + "&FILTER=" + FilterType + "",
            dataType: 'json',
            contentType: "application/json",
            async: false,
        }).then(function (data) {
            if (data.data.Table.length == 0) {
                if (FilterType == "ALLOCATEDTOME")
                    $.notify("No task allocated to you");
                if (FilterType == "ALLOCATEDBYME")
                    $.notify("No task allocated by you");
            }
            if ($scope.OrderBy == "Asc")
                $scope.FilterBy = "CREATION_DATE";
            else
                $scope.FilterBy = "-CREATION_DATE";
            $scope.Task_List = data.data.Table;
            $scope.RecourdCount = data.data.Table;
            $scope.AllData = data.data.Table;
            $scope.CountAllTask = data.data.Table1[0].Default;
            $scope.CountAllocated_To_Me = data.data.Table1[0].ALLOCATEDTOME;
            $scope.CountAllocated_By_Me = data.data.Table1[0].ALLOCATEDBYME;

            $scope.CountCOMPLETEDBYME = data.data.Table1[0].COMPLETEDBYME;
            $scope.CountCANCELCLOSE = data.data.Table1[0].CANCELCLOSE;
            $scope.CountCOMPLETEDFORME = data.data.Table1[0].COMPLETEDFORME;
            unflatten(data.data.Table);
            if (localStorage.Task.len != 0) {
                if (localStorage.Task == "GetAllocatedTask") {
                    $scope.FilterSelection = $scope._Filter[0];
                    $scope.Allocated_To_Me()
                }
                else {
                    $scope.FilterSelection = $scope._Filter[localStorage.Task];
                    $scope.FunFilterByComplterDate($scope._Filter[localStorage.Task]);
                }

            }
            else {
                $scope.FilterSelection = $scope._Filter[0];
            }

        });
    };

    $scope.GridShorting = function (selected) {
        $scope.FilterBy = selected.id;
    };

    $scope.ClkAscOrDesc = function () {
        if ($scope.OrderBy == "Asc") {
            $scope.OrderBy = "Desc";
            $scope.FilterBy = "-" + $scope.FilterBy;
        } else {
            $scope.OrderBy = "Asc";
            $scope.FilterBy = $scope.selected.id
        }
        //if ($scope.OrderBy == "Asc") {
        //    $scope.OrderBy = "Desc";
        //}
        //else
        //    $scope.OrderBy = "Asc";
    };

    $scope.items = [{
        id: 'CREATION_DATE',
        label: 'Creation Date'
    }, {
        id: 'COMPLETION_DATE',
        label: 'Completion Date'
    }];


    $scope._Filter = [{
        id: 'All',
        label: 'All'
    }, {
        id: '0',
        label: 'To-day'
    },
    {
        id: 'Over-due',
        label: 'Over-due'
    },
    {
        id: '3',
        label: 'Next 3 days'
    },
    {
        id: '7',
        label: 'Next 7 days'
    },
    {
        id: '14',
        label: 'Next 2 weeks'
    },
    {
        id: '30',
        label: 'Next month'
    },
    {
        id: 'Future',
        label: 'Future'
    }
    ];


    $scope.selected = $scope.items[0];

    $scope.GetDetails = function (details) {
        var Url = PageUrl();
        window.location.href = Url + "Task/Add_Task?Task_Num=" + details + "";
    }

    $scope.FilterBy_Date = function (ADays, AMonth) {

        $scope.AttrFilter = "";
        var date = new Date();
        var newdate = new Date(date.getFullYear(), ('0' + (date.getMonth() + AMonth)).slice(-2), ('0' + date.getDate()).slice(-2));
        var FilterDate;
        var splitDate;
        var Cmp_Date;
        var d;
        $scope.FilterData = [];
        d = ('0' + date.getDate()).slice(-2);
        d = parseInt(d) + parseInt(ADays);

        FilterDate = new Date(date.getFullYear(), ('0' + (date.getMonth() + AMonth)).slice(-2), d);
        for (var j = 0; j < $scope.AllData.length; j++) {
            splitDate = $scope.AllData[j].COMPLETION_DATE.split('/');
            Cmp_Date = new Date(splitDate[2], splitDate[1], splitDate[0]);
            if (ADays == "0") {
                if (new Date(Cmp_Date).getTime() == new Date(FilterDate).getTime())
                    $scope.FilterData.push($scope.AllData[j]);
            } else if (new Date(Cmp_Date) <= new Date(FilterDate) && new Date(FilterDate) >= new Date(Cmp_Date))
                $scope.FilterData.push($scope.AllData[j]);
        }
        $scope.Task_List = {};
        $scope.Task_List = $scope.FilterData;
    };

    $scope.FilterBy_Month = function (ADays, AMonth) {

        $scope.AttrFilter = "";
        var date = new Date();
        var newdate = new Date(date.getFullYear(), ('0' + (date.getMonth() + AMonth)).slice(-2), ('0' + date.getDate()).slice(-2));
        var FilterDate;
        var splitDate;
        var Cmp_Date;
        var d;
        $scope.FilterData = [];
        d = ('0' + date.getDate()).slice(-2);
        d = parseInt(d) + parseInt(ADays);

        FilterDate = date.getFullYear() + "-" + ('0' + (date.getMonth() + AMonth)).slice(-2);
        for (var j = 0; j < $scope.AllData.length; j++) {
            splitDate = $scope.AllData[j].COMPLETION_DATE.split('/');
            Cmp_Date = splitDate[2] + "-" + splitDate[1];
            if (Cmp_Date == FilterDate)
                $scope.FilterData.push($scope.AllData[j]);

        }
        $scope.Task_List = {};
        $scope.Task_List = $scope.FilterData;
    };

    $scope.FilterBy_AfterDate = function (ADays, AMonth) {

        $scope.AttrFilter = "";
        var date = new Date();
        var newdate = new Date(date.getFullYear(), ('0' + (date.getMonth() + AMonth)).slice(-2), ('0' + date.getDate()).slice(-2));
        var FilterDate;
        var splitDate;
        var Cmp_Date;
        var d;
        $scope.FilterData = [];
        d = ('0' + date.getDate()).slice(-2);
        d = parseInt(d) + parseInt(ADays);

        FilterDate = new Date(date.getFullYear(), ('0' + (date.getMonth() + AMonth)).slice(-2), d);
        for (var j = 0; j < $scope.AllData.length; j++) {
            splitDate = $scope.AllData[j].COMPLETION_DATE.split('/');
            Cmp_Date = new Date(splitDate[2], splitDate[1], splitDate[0]);
            //if (ADays == "0") {
            if (new Date(Cmp_Date) > new Date(newdate) && new Date(Cmp_Date) <= new Date(FilterDate))
                $scope.FilterData.push($scope.AllData[j]);
            //} else if (new Date(Cmp_Date) <= new Date(FilterDate) && new Date(FilterDate) >= new Date(Cmp_Date))
            //    $scope.FilterData.push($scope.AllData[j]);
        }
        $scope.Task_List = {};
        $scope.Task_List = $scope.FilterData;
    };


    $scope.FilterFut_Record = function (ADays, AMonth) {
        $scope.AttrFilter = "";
        var date = new Date();
        var newdate = new Date(date);
        var FilterDate;
        var splitDate;
        var Cmp_Date;
        var d;
        $scope.FilterData = [];
        d = newdate.setDate(newdate.getDate() + parseInt(ADays));
        FilterDate = new Date(date.getFullYear(), ('0' + (date.getMonth() + AMonth)).slice(-2) - 1, ('0' + newdate.getDate()).slice(-2));
        for (var j = 0; j < $scope.AllData.length; j++) {
            splitDate = $scope.AllData[j].COMPLETION_DATE.split('/');
            Cmp_Date = new Date(splitDate[2], splitDate[1], splitDate[0]);
            if (new Date(Cmp_Date) >= newdate)
                $scope.FilterData.push($scope.AllData[j]);
        }
        $scope.Task_List = {};
        $scope.Task_List = $scope.FilterData;
    };

    $scope.FunFilterByComplterDate = function (COMPLETION_DATE) {
        if (COMPLETION_DATE.id == "0") {
            ADays = COMPLETION_DATE.id
            AMonth = 1;
            $scope.FilterBy_Date(ADays, AMonth);
        }
        else if (COMPLETION_DATE.id == 3 || COMPLETION_DATE.id == "7" || COMPLETION_DATE.id == "14") {
            ADays = COMPLETION_DATE.id
            AMonth = 1;
            $scope.FilterBy_AfterDate(ADays, AMonth);

        }
        else if (COMPLETION_DATE.id == "30") {
            ADays = 0;
            AMonth = 2;
            $scope.FilterBy_Month(ADays, AMonth);
        }
        else if (COMPLETION_DATE.id == "Future") {
            ADays = 30;
            AMonth = "";
            $scope.FilterFut_Record(ADays, AMonth);
        }
        else if (COMPLETION_DATE.id != "All" && COMPLETION_DATE.id != "30" && COMPLETION_DATE.id == "Over-due") {
            ADays = COMPLETION_DATE.id;
            AMonth = 1;
            $scope.AttrFilter = "";
            var date = new Date();
            var newdate = new Date(date.getFullYear(), ('0' + (date.getMonth() + AMonth)).slice(-2), ('0' + date.getDate()).slice(-2));
            var FilterDate;
            var splitDate;
            var Cmp_Date
            var d;
            $scope.FilterData = [];
            d = newdate.setDate(newdate.getDate() + parseInt(0));
            $scope.AttrFilter = date.getFullYear() + '/' + ('0' + (date.getMonth() + AMonth)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);

            FilterDate = $scope.AttrFilter;
            for (var j = 0; j < $scope.AllData.length; j++) {
                splitDate = $scope.AllData[j].COMPLETION_DATE.split('/');
                Cmp_Date = splitDate[1] + "/" + splitDate[0] + "/" + splitDate[2];

                Cmp_Date = new Date(splitDate[2], splitDate[1], splitDate[0]); //Year, Month, Date //Cmp_Date
                FilterDate = new Date(date.getFullYear(), ('0' + (date.getMonth() + AMonth)).slice(-2), ('0' + newdate.getDate()).slice(-2));

                console.log("Cmp_Date " + Cmp_Date);
                console.log("FilterDate " + FilterDate);


                //FilterDate = new Date(date.getFullYear(), '0' + (date.getMonth() + AMonth).slice(-2), '0' + newdate.getDate().slice(-2)); //Year, Month, Date  //FilterDate




                if (new Date(Cmp_Date) < new Date(newdate)) {
                    $scope.FilterData.push($scope.AllData[j]);
                };
            }
            $scope.Task_List = {};
            $scope.Task_List = $scope.FilterData;
        } else {
            $scope.Task_List = {};
            $scope.Task_List = $scope.AllData;
        }
		/*$scope.AttrFilter = "";
		var date = new Date();
		var newdate = new Date(date);
		var FilterDate;
		var splitDate;
		var Cmp_Date
		var d;
		$scope.FilterData = [];

		if (COMPLETION_DATE.id == "0") {
		    
		    $scope.Task_List = {};
		    $scope.Task_List = $scope.FilterData;
		}

		if (COMPLETION_DATE.label == "To-day") {
		    $scope.FilterBy_Date(label.id, 0);
		}

		if (COMPLETION_DATE.label == "Next 3 days") {
		    $scope.FilterBy_Date(label.id, 0);
		}

		if (COMPLETION_DATE.label == "Next 7 days") {
		    d = newdate.setDate(newdate.getDate() + 7);
		    $scope.AttrFilter = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + newdate.getDate()).slice(-2) + '/' + date.getFullYear();

		    FilterDate = new Date($scope.AttrFilter);
		    for (var k = 0; k < $scope.AllData.length; k++) {
		        splitDate = $scope.AllData[k].COMPLETION_DATE.split('/');
		        Cmp_Date = splitDate[1] + "/" + splitDate[0] + "/" + splitDate[2];
		        Cmp_Date = new Date(Cmp_Date);
		        console.log("Cmp_Date " + Cmp_Date);
		        console.log("FilterDate " + FilterDate);
		        if (Cmp_Date.getTime() <= FilterDate.getTime() && FilterDate.getTime() >= Cmp_Date.getTime()) {
		            $scope.FilterData.push($scope.AllData[k]);
		        };
		    }
		    $scope.Task_List = {};
		    $scope.Task_List = $scope.FilterData;
		}

		if (COMPLETION_DATE.label == "Next 2 weeks") {
		    d = newdate.setDate(newdate.getDate() + 14);
		    $scope.AttrFilter = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + newdate.getDate()).slice(-2) + '/' + date.getFullYear();
		}

		if (COMPLETION_DATE.label == "Next month") {
		    d = newdate.setDate(newdate.getDate());
		    $scope.AttrFilter = ('0' + newdate.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 2)).slice(-2) + '/' + date.getFullYear();
		}
        
		$scope.CurrnetDate = new Date();//('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
		*/
    };

    //  return matched;

    // add new node at top level here
    $scope.isAddExamNode = false;
    $scope.addNewNodeAtRootLevel = function () {
        $scope.isAddExamNode = true;
        var newNode = {
            name: "new node",
            id: "",
            level: 0,
            parent: "root",
            toggleStatus: false,
            parentId: -1,
            isShow: true,
            isEditable: false,
            childCount: 0,
            isSaveBtn: false,
            isShowMessage: false,
            type: "exam"
        };
        $scope.nodesTableArr.unshift(newNode);
    };

    // add new node.
    $scope.operationStatusMessage = "";
    $scope.currentNodeSelected = {};
    var uniqueIdForNewNodes = 0;
    $scope.addChildNode = function (node) {
        // add row to table.
        $scope.operationStatusMessage = "";
        $scope.currentNodeSelected = node;
        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            if ($scope.nodesTableArr[i].id == node.id) {
                $scope.nodesTableArr.splice(i + 1, 0, {
                    name: "new node",
                    id: uniqueIdForNewNodes,
                    level: node.level + 1,
                    parent: node.name,
                    toggleStatus: false,
                    parentId: node.id,
                    isShow: true,
                    isEditable: false,
                    childCount: 0,
                    isSaveBtn: false,
                    isShowMessage: false,
                    type: "nonExam"
                });
                break;
            }
        }

        uniqueIdForNewNodes += 1;
    };

    $scope.saveNewNode = function (node, isExamNode) {
        alert("You can send request on server to add this node here.");
        $scope.saveNewNodeCB();
    };

    $scope.saveNewNodeCB = function () {
        $scope.resetOperationStatusMessage();
        $scope.operationStatusMessage = "node Saved Successfully";
        $scope.currentNodeSelected.isShowMessage = true;
        $scope.currentNodeSelected.isSaveBtn = false;

        // update node id in newly added node object, so that if we add new node under it, it has its valid parent id.
        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            var node = $scope.nodesTableArr[i];
            if (node == $scope.conceptNodeToAdd)
                node.id = response.data.node;
        }
        alert("send request to server here to save this node.");
    };

    $scope.editNode = function (node) {
        $scope.nodeNameInOperation = node.name;
        $scope.operationStatusMessage = "";
        $scope.currentNodeSelected = node;
        var nodeName = prompt("Please enter New node Name", node.name);
        if (nodeName != "" && nodeName != null && node.name != undefined && nodeName != node.name) {
            node.name = nodeName;
            if (node.id != "") {
                node.isUpdateBtn = true;
            } else {
                node.isSaveBtn = true;
            }
        }
    };

    $scope.updateNode = function (node) {
        alert("You can send request on server to update this node.");
        $scope.updateNodeCB();
    };

    $scope.updateNodeCB = function (response) {

        $scope.resetOperationStatusMessage();
        if (true) {
            $scope.currentNodeSelected.isShowMessage = true;
            $scope.operationStatusMessage = "node Updated Successfully";
            $scope.currentNodeSelected.isUpdateBtn = false;
        }
    };

    // nodeType = concept/nonConcept
    $scope.nodeToDelete = {};
    $scope.deleteNode = function (node, nodeType) {

        $scope.nodeNameInOperation = node.name;
        $scope.nodeTypeForMessage = nodeType;
        $scope.nodeToDelete = node;
        $scope.operationStatusMessage = "";
        $scope.currentNodeSelected = node;
        var message;
        if (node.id == "") {
            for (var i = 0; i < $scope.nodesTableArr.length; i++) {
                if ($scope.nodesTableArr[i] == $scope.currentNodeSelected)
                    $scope.nodesTableArr.splice(i, 1);
            }
            return 0;
        }
        var r = confirm("Warning! Be Carefull! On deletion all nodes under this node will be deleted.\nPress ok to delete node");
        if (r == true) {
            $scope.deleteNodeCB();
            message = "nodes deleted successfully.";
        } else {
            message = "process cancelled.";
        }
        $scope.curPageNo = 1;
    };

    $scope.deleteNodeCB = function () {

        $scope.resetOperationStatusMessage();
        $scope.operationStatusMessage = "node deleted Successfully";
        $scope.currentNodeSelected.isShowMessage = true;

        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            if ($scope.nodesTableArr[i] == $scope.currentNodeSelected)
                $scope.nodesTableArr.splice(i, 1);
        }
    };

    $scope.resetOperationStatusMessage = function () {
        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            $scope.nodesTableArr[i].isShowMessage = false;
        }
    };

    var node = "";
    $scope.nodesTableArr = [];
    $scope.initializeNodeTreeTable = function (pChildArr) {
        var length = pChildArr.length || 0;
        for (var i = 0; i < length; i++) {

            var exam = pChildArr[i];
            var level = 0;
            var childCount = 0;
            if (exam.children && exam.children.length)
                childCount = exam.children.length;
            $scope.nodesTableArr.push({
                name: exam.text,
                id: exam._id,
                parent: "root",
                toggleStatus: false,
                parentId: -1,
                isShow: true,
                isEditable: false,
                level: 0,
                childCount: childCount,
                isSaveBtn: false,
                isUpdateBtn: false
            });
            if (exam.children != undefined)
                $scope.initializeNodeTreeTableHelper(exam.children, exam.text, exam._id, level);

        }
    };

    $scope.initializeNodeTreeTableHelper = function (pChildArr, pParentName, pPparentId, pLevel) {
        var isShowNode = false;
        pLevel = pLevel + 1;
        for (var i = 0; i < pChildArr.length; i++) {
            var node = pChildArr[i];
            var childCount = node.children != undefined ? node.children.length : 0
            $scope.nodesTableArr.push({
                name: node.text,
                id: node._id,
                parent: pParentName,
                toggleStatus: false,
                parentId: pPparentId,
                isShow: isShowNode,
                isEditable: false,
                level: pLevel,
                childCount: childCount,
                isSaveBtn: false,
                isUpdateBtn: false
            });
            if (node.children != undefined)
                $scope.initializeNodeTreeTableHelper(node.children, node.text, node._id, pLevel)
        }
    };

    $scope.selectedExam = "";
    $scope.renderNodeTreeForExam = "selectedExamNode";
    $scope.renderNodeTreeForExam = function (exam) {
        $scope.nodesTableArr = [];
        $scope.selectedExam = exam;
        var selectedExamArr = [exam];
        if ($scope.selectedExam == "allExams")
            selectedExamArr = $scope.allExams
        $scope.getAllNodes(selectedExamArr);
    };

    // view related functions.
    $scope.selectIndentationClass = function (node) {
        return 'level' + node.level;
    };

    $scope.hasDropdown = function (node) {
        if (node.childCount > 0)
            return "hasDropdown";
        else
            return "noDropdown";
    };

    $scope.colorBackgroundOfNewNode = function (node) {
        if (node.id == "") {
            return "success";
        }
    };


    $scope.toggleStatus = false;
    $scope.toggleDropdown = function (node) {
        node.toggleStatus = node.toggleStatus == true ? false : true;
        $scope.toggleStatus = node.toggleStatus;
        $scope.toggleDropdownHelper(node.id, $scope.toggleStatus);
    };

    $scope.toggleDropdownHelper = function (parentNodeId, toggleStatus) {
        for (var i = 0; i < $scope.nodesTableArr.length; i++) {
            node = $scope.nodesTableArr[i];
            if (node.parentId == parentNodeId) {
                if (toggleStatus == false)
                    $scope.toggleDropdownHelper(node.id, toggleStatus);
                $scope.nodesTableArr[i].isShow = toggleStatus;
            }
        }
    };

    $scope.showAll = false;
    $scope.expandAll = function () {
        var i = 0;
        $scope.showAll = $scope.showAll == true ? false : true;
        if ($scope.showAll) {
            for (i = 0; i < $scope.nodesTableArr.length; i++)
                $scope.nodesTableArr[i]['isShow'] = true;
        } else {
            for (i = 0; i < $scope.nodesTableArr.length; i++)
                if ($scope.nodesTableArr[i]['level'] != 0)
                    $scope.nodesTableArr[i]['isShow'] = false;
        }
    };

    $scope.Allocated_To_Me = function () {
        localStorage.Task = "0";
        $scope.Get_Task_Details("ALLOCATEDTOME");
        $scope.StlAllTask = "";
        $scope.StlAllocated_By_Me = "";
        $scope.StlComplForMe = "";
        $scope.StlComplByMe = "";
        $scope.StlCancelled = "";
        $scope.StlAllocated_To_Me = {
            "background-color": "#2196F3",
            "color": "#fff"
        };
    };

    $scope.ComplByMe = function () {
        localStorage.Task = "0";
        $scope.Get_Task_Details("COMPLETEDBYME");
        $scope.StlAllocated_By_Me = "";
        $scope.StlAllocated_To_Me = "";
        $scope.StlAllTask = "";
        $scope.StlComplForMe = "";
        $scope.StlCancelled = "";
        $scope.StlComplByMe = {
            "background-color": "#2196F3",
            "color": "#fff"
        };
    };

    $scope.ComplForMe = function () {
        localStorage.Task = "0";
        $scope.Get_Task_Details("COMPLETEDFORME");
        $scope.StlAllocated_By_Me = "";
        $scope.StlAllocated_To_Me = "";
        $scope.StlAllTask = "";
        $scope.StlComplByMe = "";
        $scope.StlCancelled = "";
        $scope.StlComplForMe = {
            "background-color": "#2196F3",
            "color": "#fff"
        };
    };

    $scope.Allocated_By_Me = function () {
        localStorage.Task = "0";
        $scope.Get_Task_Details("ALLOCATEDBYME");
        $scope.StlAllocated_To_Me = "";
        $scope.StlAllTask = "";
        $scope.StlComplForMe = "";
        $scope.StlComplByMe = "";
        $scope.StlCancelled = "";
        $scope.StlAllocated_By_Me = {
            "background-color": "#2196F3",
            "color": "#fff"
        };
    };

    $scope.Cancelled = function () {
        localStorage.Task = "0";
        $scope.Get_Task_Details("CANCELCLOSE");
        $scope.StlAllocated_To_Me = "";
        $scope.StlAllTask = "";
        $scope.StlComplForMe = "";
        $scope.StlComplByMe = "";
        $scope.StlAllocated_By_Me = "";
        $scope.StlCancelled = {
            "background-color": "#2196F3",
            "color": "#fff"
        };
    }


    $scope.AllTask = function () {
        localStorage.Task = "0";
        $scope.Get_Task_Details("DEFAULT");

        $scope.StlAllocated_By_Me = "";
        $scope.StlAllocated_To_Me = "";
        $scope.StlComplForMe = "";
        $scope.StlCancelled = "";
        $scope.StlAllTask = {
            "background-color": "#2196F3",
            "color": "#fff"
        };
    };

    $scope.showDetails = function (_status) {
        $scope.ShowMouseHoverStatus = _status;
    };

    $scope.showTaskDesc = function (TaskDesc) {
        $scope.ShowMouseHoverTaskDesc = TaskDesc;
    };


    /*Call All function for bind Details start*/
    $scope.Get_Task_Details("DEFAULT");

    /*Call All function for bind Details End*/
})


function unflatten(arr) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['items'] = [];
        mappedArr[arrElem.id]['Path'] = [];
    }
    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.parentid) {
                mappedArr[mappedElem['parentid']]['items'].push(mappedElem);
                console.log(mappedArr[mappedElem['parentid']]['items'].push(mappedElem));
            }
            // If the element is at the root level, add it to first level elements array.
            else {

                tree.push(mappedElem);
                console.log(mappedElem);
            }
        }
    }
    return tree;
};