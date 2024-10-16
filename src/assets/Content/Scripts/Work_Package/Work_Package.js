var app = angular.module('MyApp', []);
app.controller('WorkPackageController', function ($scope, $http, $window) {
    $scope.TemplateOption = [
        {
            MKEY: "WP",
            TYPE_DESC: "Work Package"
        },
        {
            MKEY: "Rec",
            TYPE_DESC: "Recurring"
        }
    ];
    $scope.Template = $scope.TemplateOption[0];

    localStorage.CurrentPage = "";
    localStorage.CurrentPage = "WorkPackage";

    $scope.txtShow = false;
    $scope._IsWorkPackage = true;

    $scope.disEnd = true;

    $(function () {

        var appendthis = ("<div class='modal-overlay js-modal-close'></div>");

        $('a[data-modal-id]').click(function (e) {
            e.preventDefault();
            $("body").append(appendthis);
            $(".modal-overlay").fadeTo(500, 0.7);
            var modalBox = $(this).attr('data-modal-id');
            $('#' + modalBox).fadeIn($(this).data());
        });


        $(".js-modal-close, .modal-overlay").click(function () {
            $(".modal-box_1, .modal-overlay").fadeOut(500, function () {
                $(".modal-overlay").remove();
            });

        });

        $(window).resize(function () {
            $(".modal-box_1").css({
                top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
                left: ($(window).width() - $(".modal-box").outerWidth()) / 2
            });
        });

        $(window).resize();

    });

    $scope.FunaFTERChange = function (d) {

        if (d == "On") {
            $scope.disEnd = false;
        }
        else {
            $scope.disEnd = true;
            $scope.txtEndOn = "";
        }
    }

    $scope.DynamciCntrl = [{ id: 'Desc_0', name: '' }];

    $scope.showDynamciCntrl = function (_DynamciCntrl) {
        return _DynamciCntrl.id === $scope.DynamciCntrl[$scope.DynamciCntrl.length - 1].id;
    };
    $scope.AddNew = function () {
        var newItemNo = $scope.showDynamciCntrl.length + 1;
        $scope.DynamciCntrl.push({ 'id': 'Desc_' + newItemNo, 'name': '' });
    };

    $scope.removeCntrl = function (Index) {
        for (var i = 0; i < $scope.DynamciCntrl.length; i++) {
            if (Index == i) {
                $scope.DynamciCntrl.splice(Index, 1);
            }
        }

    };


    $scope.Cat = "Seq";

    $scope._ChangeTemp = function (_Opt) {
        if (_Opt.MKEY == "Rec")
            $scope._IsWorkPackage = false;
        else
            $scope._IsWorkPackage = true;
    }
    $scope._ChngCategory = function (val) {

        var v = $('#ddlCat_' + val + ' option:selected').val();
        if (v == "Par")
            $scope.txtShow = true;
        else
            $scope.txtShow = false;
    }

    $(document).ready(function () {
        $('#ddlDoesNtRpt').click(function () {
            //$('#commentPopupNew').modal("show");
        })
    })
})