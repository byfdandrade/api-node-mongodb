export default{
    isEmpty: function (value) {
        if (!value || typeof value == undefined ||  value == null) {
            return true;
        } else {
            return false;
        } 
    },
}