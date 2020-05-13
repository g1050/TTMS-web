package models

import (
	"astaxie/beego/logs"
	"astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

/*
定义数据结构、连接数据库、建表、建库。
 */
type Employee struct {
	EmpId 			int64 	`orm:"pk;auto" json:"emp_id"`//员工ID
	//Emp_LoginName 	string 	`orm:"size(30)" json:"emp_login_name"`//员工姓名
	EmpPassword 	string 	`orm:"size(32)" json:"emp_password"`//密码
	EmpName 		string 	`orm:"size(30)" json:"emp_name"`//名字
	EmpBornyear 	string 	`orm:"size(10)" json:"emp_born_year"`//出生年月
	EmpPhonenumber string 	`orm:"size(15);unique" json:"emp_phonenumber"`//手机号
	EmpPrivilege 	int 	`json:"emp_privilege"`//权限
}

func init() {
	//连接Mysql数据库
	orm.RegisterDataBase("default", "mysql", "root:123456@tcp(47.94.14.45:3306)/ttms?charset=utf8", 30) //最后是一个超时时间
	//注册model
	orm.RegisterModel(new(Employee))
	//创建表,第二个参数表示如果存在该表是否覆盖
	orm.RunSyncdb("default",false,true)

	logs.Debug("init database .....")
	o := orm.NewOrm()
	logs.Debug(o)
}
