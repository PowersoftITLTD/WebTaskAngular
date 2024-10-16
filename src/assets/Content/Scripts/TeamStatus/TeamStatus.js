var app = angular.module('MyApp', []);
app.controller('Team_Status', function ($scope, $http, $window) {
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
        label: 'Start Date'
    }, {
        id: 'COMPLETION_DATE',
        label: 'Due Date'
    }];


    $scope._Filter = [ {
        id: '0',
        label: 'Department To-day'
    },
    {
        id: 'Department Over-due',
        label: 'Department Over-due'
    },
    {
        id: 'Department Future',
        label: 'Department Future'
    },
    {
        id: 'Inter-Department To-day',
        label: 'Inter-Department To-day'
    },
    {
        id: 'Inter-Department Over-due',
        label: 'Inter-Department Over-due'
    },
    {
        id: 'Inter-Department Future',
        label: 'Inter-Department Future'
    }
    ];


    $scope.selected = $scope.items[0];

    $scope.GetDetails = function (details) {
        var Url = PageUrl();
        window.location.href = Url + "Task/Add_Task?Task_Num=" + details + "";
    }



    $scope.Get_Task_Details = function () {
        
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/Team_Task_Details?CURRENT_EMP_MKEY=1&TASKTYPE=" + localStorage.TASKTYPE + "&TASKTYPE_DESC=" + localStorage.TaskType_desc + "&mKEY=233",
            dataType: 'json',
            contentType: "application/json",
            async: false,
        }).then(function (data) {
            
            $scope.Task_List = data.data;
        })
        /*Call All function for bind Details End*/
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
        // $scope.Get_Task_Details("ALLOCATEDTOME");
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
        //  $scope.Get_Task_Details("COMPLETEDBYME");
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
        //   $scope.Get_Task_Details("COMPLETEDFORME");
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
        //  $scope.Get_Task_Details("ALLOCATEDBYME");
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
        //   $scope.Get_Task_Details("CANCELCLOSE");
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

    $scope.FunFilterByComplterDate = function (type1) {
        if (type1.label == "Department To-day") {
            localStorage.TaskType_desc = 'DEPT-TODAY';
            localStorage.TASKTYPE = "DEPERTMENT";
        }
        if (type1.label == "Department Over-due") {
            localStorage.TaskType_desc = 'DEPT-OVERDUE';
            localStorage.TASKTYPE = "DEPERTMENT";
        }
        if (type1.label == "Department Future") {
            localStorage.TaskType_desc = 'DEPT-FUTURE';
            localStorage.TASKTYPE = "DEPERTMENT";
        }
        if (type1.label == "Inter-Department To-day") {
            localStorage.TaskType_desc = 'INTERDEPT-TODAY';
            localStorage.TASKTYPE = "INTER-DEPERTMENT";
        }
        if (type1.label == "Inter-Department Over-due") {
            localStorage.TaskType_desc = 'INTERDEPT-OVERDUE';
            localStorage.TASKTYPE = "INTER-DEPERTMENT";
        }
        if (type1.label == "Inter-Department Future") {
            localStorage.TaskType_desc = 'INTERDEPT-FUTURE';
            localStorage.TASKTYPE = "INTER-DEPERTMENT";
        }
        $scope.TeamsStatus();
    }
    /*Call All function for bind Details start*/
    //$scope.Get_Task_Details("DEFAULT");
    $scope.TeamsStatus = function () {
        $http({
            method: 'GET',
            url: Geturl + "Task-Management/Team_Task_Details?CURRENT_EMP_MKEY=" + localStorage.emp_Mkey + "&TASKTYPE=" + localStorage.TASKTYPE + "&TASKTYPE_DESC=" + localStorage.TaskType_desc + "&mKEY=" + localStorage.Responsible_Emp_meky + "",
            dataType: 'json',
            contentType: "application/json",
            async: false,
        }).then(function (data) {
            
            $scope.Task_List = data.data;
            $scope.RecourdCount = data.data;
            //$scope.FilterSelection = localStorage.TaskType_desc;
            //
            if (localStorage.TaskType_desc == "DEPT-DEPTTODAY") {
                $scope.FilterSelection = $scope._Filter[0];
            }
            if (localStorage.TaskType_desc == "DEPT-OVERDUE") {
                $scope.FilterSelection = $scope._Filter[1];
            }
            if (localStorage.TaskType_desc == "DEPT-FUTURE") {
                $scope.FilterSelection = $scope._Filter[2];
            }
            if (localStorage.TaskType_desc == "INTERDEPT-TODAY") {
                $scope.FilterSelection = $scope._Filter[3];
            }
            if (localStorage.TaskType_desc == "INTERDEPT-OVERDUE") {
                $scope.FilterSelection = $scope._Filter[4];
            }
            if (localStorage.TaskType_desc == "INTERDEPT-FUTURE") {
                $scope.FilterSelection = $scope._Filter[5];
            }
        })
    }
    $scope.TeamsStatus();
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