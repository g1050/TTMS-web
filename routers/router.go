package routers

import (
	"fmt"
	"ttms/controllers"
	"github.com/astaxie/beego"
)

func init() {
	fmt.Println("router-------")
    beego.Router("/", &controllers.MainController{})
	beego.Router("/account/login/session", &controllers.AccountController{},"Get:GetUserSession")
	beego.Router("/account/register/info", &controllers.AccountController{},"Post:PostUserData")

}
