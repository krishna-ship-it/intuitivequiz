<!-- endpoints -->
<!-- user -->

@get
/ ==> loged in user ==> using cookies ('token')
/login ==> login ==> email,password

@post
/signup ==> signup ==> email,name,password
/upload-picture ==> upload image ==> upload image on logged in user

@patch
/change-password ==> change password ==> change passwrod of logged in user ==> previous pass and new pass

@delete
/ ==> delete acc ==> delete account of logged in user , using password
