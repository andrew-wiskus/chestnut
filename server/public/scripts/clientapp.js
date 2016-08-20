$(document).ready(function() {
    getData();

    //button listeners
    $('#submitTestData').on("click", postData);
    $('#dataTable').on("click", ".delete", deleteData);
    $('#dataTable').on("click", ".update", updateData);
});

function deleteData() {
    var testdataID = $(this).attr("id");

    $.ajax({
        type: 'DELETE',
        url: '/testRoute/' + testdataID,
        success: function() {
            console.log('DELETED ITEM: ID:', testdataID);

            $('#dataTable').empty();
            getData();
        },
        error: function() {
            console.log("error in delete");
        }
    });
}

function updateData() {
    var testdata = {};
    //goes into data table to grab all data within.
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field) {
        testdata[field.name] = field.value;

        //CHECK FOR INT IF INPUTING NUM:
        checkNumInField(field, "item_amount");
    });
    console.log("updateData searches through:", testdata);

    //finds updateButton's appened id refrencing rowValue.id
    var testdataID = $(this).parent().attr('id');

    $.ajax({
        type: 'PUT',
        url: '/testRoute/' + testdataID,
        data: testdata,
        success: function() {
            $('#dataTable').empty();
            getData();
        },
        error: function() {

        }
    });

}

function postData() {
    event.preventDefault();

    var testdata = {};

    $.each($('#dataForm').serializeArray(), function(i, field) {
        testdata[field.name] = field.value;
        checkNumInField(field, "item_amount");
    });

    $.ajax({
        type: 'POST',
        url: '/testRoute',
        data: testdata,
        success: function() {
            console.log('/POST success function ran');
            //empty and repopulate #dataTable
            $('#dataTable').empty();
            getData();

        },
        error: function() {
            console.log('/POST didnt work');
        }

    });


}

function getData() {
    $.ajax({
        type: 'GET',
        url: '/testRoute',
        success: function(data) {
            console.log('/GET success function ran');
            buildTableHeader(['Item ID', 'Item Name', 'Item Amount']);

            data.forEach(function(rowData, i) {
                var $el = $('<div id="' + rowData.id + '"></div>');

                var dataTable = ['id', 'item_name', 'item_amount'];
                dataTable.forEach(function(property) {

                    var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
                    $input.val(rowData[property]);
                    $el.append($input);

                });

                $el.append('<button id=' + rowData.id + ' class="update">Update</button>');
                $el.append('<button id=' + rowData.id + ' class="delete">Delete</button>');
                $el.append('<button id=' + rowData.id + ' class="checkInOut">Check In</button>');

                $('#dataTable').append($el);
            });
        },

        error: function(response) {
            console.log('GET /testRoute fail. No data could be retrieved!');
        },
    });

}


// Display/Quality of Life
function checkNumInField(theField, numField) {
    if (theField.name == numField) {
        if (theField.value * 0 !== 0) {
            alert("You must input numbers in 'Amount' field");
            location.reload();
        }
    }
}

function buildTableHeader(headerList) {

    var $header = $('<div id="dataTableHead"></div>');
    headerList.forEach(function(property) {

        var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
        $input.val(property);
        $header.append($input);
        $('#dataTable').append($header);
    });
}
