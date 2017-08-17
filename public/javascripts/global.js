// Delete object
function deleteObject(id, callback) {

    // Pop up a confirmation dialog
    var confirmation = confirm("This will delete the object.\nAre you sure?");

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/stubs/' + id
        }).done(function( response ) {
            showMessage(response.msg, "green");
            
            // Update the table
            callback();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }

};

// Delete object
function copyObject(id) {
    $.ajax({
        type: 'GET',
        url: '/stubs/' + id,
    }).done(function( data ) {
        showForm();
        $('#newName').val('');
        $('#newCategory').val(data.category);
        $('#newPath').val(data.path);
        $('#newNotes').val(data.notes);
        $('#newCode').val(data.code);
        $('#newResponse').val(data.response);
    });
};

function toggleStatus(id, status, callback) {
    $.ajax({
        type: 'PUT',
        url: '/stubs/' + id + '/' + status,
    }).done(function( response ) {
        callback();
    });
}

// Close Detail Popup
function closeDetail(locator,active) {
    $(locator).css({'display': 'none'});
    $(active + ' .active').removeClass("active");
};

function showForm() {

    var el = $('#newStub');
    var w = el.width();
    var h = el.height();
    el.css('margin-left', -w/2);
    el.css('margin-top', -h/2);

    // Show the popup
    document.getElementById("newStub").style.display='block';
};

// Close Form Popup
function closeForm(locator) {
    $(locator).css({'display': 'none'});
};

function showMessage(message, color) {
    var el = $('#message');
    el.addClass(color);
    el.text(message);
    var w = el.width();
    var h = el.height();
    el.css('margin-left', -w/2);
    el.css('margin-top', -h/2);
    el.show(0).delay(5000).hide(0);
}

// Update nav with passed path and link text
function updateNav(text, path) {
    $('#nav').append(' > <a href="' + path + '">' + text + '</a>')
}

// Get time ago from Mongo objectId
function dateFromObjectId(objectId) {
    return timeSince(new Date(parseInt(objectId.substring(0, 8), 16) * 1000));
};

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}