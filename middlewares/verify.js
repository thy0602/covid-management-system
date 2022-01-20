const jwt = require('jsonwebtoken');

exports.verify = (req, role) => {
    // console.log(role);
    if (!req.cookies.user)
        return false;
    const temp = jwt.decode(req.cookies.user, true).username;
    if (role == 'user' && temp.search('ID_') != -1)
        return true;
    if (role == 'admin' && temp.search('admin') != -1)
        return true;
    if (role == 'manager' && temp.search('M_') != -1)
        return true;
    return false;
}
