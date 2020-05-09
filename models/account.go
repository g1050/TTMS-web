package models

import (
	"astaxie/beego/orm"
)

func InsertEmployee(employee Employee)(error,int64) {
	o := orm.NewOrm()
	id,err := o.Insert(&employee)
	return err,id
}