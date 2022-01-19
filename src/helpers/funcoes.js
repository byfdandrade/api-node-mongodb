module.exports = {
    isEmpty: function (value) {
        if (!value || typeof value == undefined ||  value == null) {
            return true;
        } else {
            return false;
        } 
    },

}