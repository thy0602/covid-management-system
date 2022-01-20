

exports.verify = (req, role) => {

    if (!req.cookies.user)
        return false;

    let temp = require('jsonwebtoken').decode(req.cookies.user, true).username;
    if (role == 'user' && temp.search('ID_') != -1)
        return true;
    if (role == 'admin' && temp.search('admin') != -1)
        return true;
    if (role == 'manager' && temp.search('M_') != -1)
        return true;
    return false;
}
