//ONE WAY OF WRITING A FUNCTION
module.exports.getDate = getDate;

function getDate() {
    let today = new Date();

    let options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };
    let day = today.toLocaleDateString("en-GB", options);

    return day;
}

//SECOND WAY OF WRITING A FUNCTION AND SHORTCUT OUR CODE

exports.getday = function () {
    let today = new Date();

    let options = {
        weekday: "long",
    };
    let day = today.toLocaleDateString("en-GB", options);

    return day;
};
