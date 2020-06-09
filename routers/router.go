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

	//影片管理
	beego.Router("/movie/create/info", &controllers.MovieController{},"Post:InsertMovie")
	beego.Router("/movie/create/image/:id", &controllers.MovieController{},"Post:InsertMovieImage")
	beego.Router("/movie/delete", &controllers.MovieController{},"Get:DeleteMovie")
	beego.Router("/movie/retrieve/:page", &controllers.MovieController{},"Get:GetMovie")
	beego.Router("/movie/update", &controllers.MovieController{},"Post:UpdateMovie")
	beego.Router("/movie/retrieve", &controllers.MovieController{},"Get:GetHint")
	beego.Router("/movie/retrieve/name", &controllers.MovieController{},"Get:GetMovieByName")

	//座位管理
	beego.Router("/seat/retrieve", &controllers.SeatController{},"Get:GetSeat")
	beego.Router("/seat/update", &controllers.SeatController{},"Post:UpdateSeat")

	//演出计划管理
	beego.Router("/schedule/create", &controllers.ScheduleController{},"Post:InsertSchedule")
	beego.Router("/schedule/delete", &controllers.ScheduleController{},"Get:DeleteSchedule")
	beego.Router("/schedule/update", &controllers.ScheduleController{},"Post:UpdateSchedule")
	beego.Router("/schedule/retrieve/:page", &controllers.ScheduleController{},"Get:GetSchedule")
	beego.Router("/schedule/retrieve/bymovie", &controllers.ScheduleController{},"Get:GetScheduleByMovie")

	//票务管理
	beego.Router("/ticket/retrieve/:page", &controllers.TicketController{},"Get:GetTicket")
	beego.Router("/ticket/retrieve/bysch", &controllers.TicketController{},"Get:GetTicketByScheduleId")
	beego.Router("/ticket/update", &controllers.TicketController{},"Post:UpdateTicket")
	beego.Router("/ticket/retrieve/byid", &controllers.TicketController{},"Get:GetTicketById")
	beego.Router("ticket/update/return", &controllers.TicketController{},"Post:UpdateTicketReturn")

	//订单管理
	beego.Router("/record/retrieve/:page", &controllers.RecordController{},"Get:GetRecord")
	beego.Router("/record/performance/:page", &controllers.RecordController{},"Get:GetPerformance")
	beego.Router("/record/boxoffice/:page", &controllers.RecordController{},"Get:GetBoxOffice")




}
