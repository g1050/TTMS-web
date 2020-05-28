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

	//员工管
	beego.Router("/user/retrieve/:page", &controllers.UserController{},"Get:GetUserData")
	beego.Router("/user/create", &controllers.UserController{},"Post:InsertUserData")
	beego.Router("/user/updata", &controllers.UserController{},"Post:UpdateUserData")
	beego.Router("/user/delete", &controllers.UserController{},"Get:DeleteUserData")
	beego.Router("/user/retrieve", &controllers.UserController{},"Get:GetHint")
	beego.Router("/user/retrieve/name", &controllers.UserController{},"Get:GetUserByName")

	//演出厅管理
	beego.Router("/studio/create", &controllers.StudioController{},"Post:InsertStudio")
	beego.Router("/studio/delete", &controllers.StudioController{},"Get:DeleteStudio")
	beego.Router("/studio/retrieve/:page", &controllers.StudioController{},"Get:GetStudioData")
	beego.Router("/studio/update", &controllers.StudioController{},"Post:UpdateStudio")
	beego.Router("/studio/retrieve", &controllers.StudioController{},"Get:GetHint")
	beego.Router("/studio/retrieve/name", &controllers.StudioController{},"Get:GetStudioByName")


}
