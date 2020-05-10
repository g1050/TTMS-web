package main

import (
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/plugins/cors"
	"ttms/models"
	_"ttms/models"
	_ "ttms/routers"
)

func main() {

	employee := models.Employee{}
	employee.EmpId = 1
	employee.EmpName = "Jack"
	employee.EmpPhonenumber = "15533052683"

	res,_:= json.Marshal(employee)
	fmt.Printf("%s\n",string(res))


	//解决跨域问题
	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		AllowCredentials: true,
	}))
	beego.Run()
}

