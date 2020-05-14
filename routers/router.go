package routers

import (
	"fmt"
	"ttms/controllers"
	"github.com/astaxie/beego"
)

func init() {
	fmt.Println("router-------")
    beego.Router("/", &controllers.MainController{})

	//账户管理模块
	beego.Router("/account/login/session", &controllers.AccountController{},"Get:GetUserSession")
	beego.Router("/account/register/info", &controllers.AccountController{},"Post:PostUserData")
	beego.Router("/account/login/verify", &controllers.AccountController{},"Post:VerifyUser")

	//员工管理
	beego.Router("/user/retrieve/:page", &controllers.UserController{},"Get:GetUserData")
	beego.Router("/user/create", &controllers.UserController{},"Post:InsertUserData")
	beego.Router("/user/updata", &controllers.UserController{},"Post:InsertUserData")
	/*
	beego.Router("/user/update", &controllers.UserController{},"Post:InsertUserData")
	 */


}
