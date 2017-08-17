// DOM Ready =============================================================
$(document).ready(function() {
    $("#contentTitle").text(currentCategory);

    // Populate Navigation
    populateNav();

    // Populate the stub cards on initial page load
    loadContent();

    // Show Latest Test Detail
    // $('#projectCards').on('click', 'div.card', openTestDetail);

    // Process any clicks on data table rows
    $('#stubResults').on('click', 'div.actionable', trClick);

    currentCategory === 'All' ? $('#newCategory').val("") : $('#newCategory').val(currentCategory);
});

// Functions =============================================================
// Fill Navigation panel
function populateNav() {
    var content = '<button onClick="showForm()">Add New Stub</button>'
    content += '<h3>Categories</h3>';
    content += '<div><a href="/stubs/view/categories/All">All Stubs</a></div>';
    $.getJSON('/stubs/categories', function(docs){
        $.each(docs, function() {
            content += '<div><a href="/stubs/view/categories/' + this + '">' + this + '</a></div>';
        });
        $('#navContent').html(content);
    });

}

function loadContent() {
    populateStubs(currentCategory);
}

// Fill dashboard with cards
function populateStubs(categoryName) {

    // Initialize the content string to empty
    var content = '';

    // Set the locator for the data table
    var locator = "#contentData";

    // Get all stubs
    $.getJSON('/stubs/categories/' + categoryName, function(docs) {
        var content = '<div id="results">';
        var lastPath = '';
        var thisClass = 'even_row';
        // Add a row for each stub
        $.each(docs, function(i){
            data = this;
            if(this.path != lastPath) {
                (thisClass === 'even_row') ? thisClass = 'odd_row' : thisClass = 'even_row';
            }
            lastPath = this.path

            // Add the row with data to use for the click events
            content += '<div id="' + this._id + '" class="row ' + thisClass + '" rel="' + this._id + '">';
            
            // Choose which dot color to show based on the result
            if(this.status === 1){
                var statusToggle = 'on';
                var activeLink = 'Disable';
            }
            else {
                var statusToggle = '';
                var activeLink = 'Enable';
            }
            content += '<div class="row_panel"><div class="switch ' + statusToggle + '" onclick="toggleStatus(\'' + this._id + '\', \''+ activeLink.toLowerCase() + '\',loadContent)"><div class="slider ' + statusToggle + '"></div></div></div>';

            // Fill in the columns with the scenario and result data
            prefix = '';
            currentCategory === 'All' ? prefix = this.category + ': ' : prefix = '';
            content += '<div style="width: 30%" class="actionable row_panel" rel="' + this._id + '"><div>' + prefix + this.name + '</div>';
            content += '<div>' + this.path + '</div></div>';
            content += '<div class="row_panel actionable" rel="' + this._id + '">' + (this.code || 200) + '</div>';
            content += '<div  style="width: 50%"class="row_panel actionable" rel="' + this._id + '">' + this.notes + '</div>';
            content += '<div class="row_panel row_actions">';
            content += '<span><img src="/images/copy.png" class="icons" onclick="copyObject(\'' + this._id + '\')" /></span>';
            content += '<span><img src="/images/delete.png" class="icons" onclick="deleteObject(\'' + this._id + '\', loadContent)" /></span>';
            
            content += '</div>';

            // Finish this row
            content += '</div>';

        });
        content += '</div>';

        // Update the data table with all the scenarios and results
        $(locator).html(content);

    });
}

// Display the test detail div and get test data
function showStubDetail( id ) {

    // Position the testDetail div relative to the click
    $("#stubDetail.popup").css( {
        position:"absolute", 
        top:event.pageY, 
        left: event.pageX});

    // Get the result and scenario data
    $.getJSON( '/stubs/' + id, function(data) {
        // Populate the Stub details
        $('#stubName').text(data.name);
        $('#stubPath').text(data.path);
        $('#stubResponse .notes').text(data.response);

        // Show the popup
        document.getElementById("stubDetail").style.display='block';

    });
};

// Add new Stub
function addNewStub(event) {
    event.preventDefault();
    var formData = {};
    $.each($('#newStubForm').serializeArray(), function(){
        if($(this)[0].name === 'code'){
            formData['code'] = +($(this)[0].value);
        }
        else if($(this)[0].name === 'response'){
            formData['response'] = JSON.parse($(this)[0].value);
        }
        else{
            formData[$(this)[0].name] = $(this)[0].value;
        }
        
    });
    $.ajax({
        type: 'POST',
        url: '/stubs',
        data: JSON.stringify(formData),
        contentType: 'application/json'
    }).done(function( response ) {
        showMessage(response.msg, "green");
        closeForm('#newStub');
        populateStubs(currentCategory);
    });
}



function trClick(event){
    event.preventDefault();
    console.log("made it");
    // If user clicked on the delete link, remove the object Mongo
    if(event.target.tagName === 'SPAN'){
        deleteObject("/stubs/" + $(this).attr('rel'),populateAllStubTables);
    }
    // Otherwise, go to the detail page for the object
    else {
        showStubDetail($(this).attr('rel'))
    }
}