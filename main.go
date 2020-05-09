package main

import (
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego"
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

	beego.Run()
}

