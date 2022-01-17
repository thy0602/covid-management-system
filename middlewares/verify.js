

exports.verify = (req, role) => {
    console.log(role);
    if (role == 'user' && req.cookies.user.search('ID_') != -1)
        return true;
    if (role == 'admin' && req.cookies.user.search('admin') != -1)
        return true;
    if (role == 'manager' && req.cookies.user.search('manager') != -1)
        return true;
    return false;
}