package models

import (
	"astaxie/beego/logs"
	"astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

//权限
const (
	MG_EMP = 1
	MG_STU = 2
	MG_MOV = 4
	MG_SCH = 8
	MG_QUERY_STU = 16
	MG_QUERY_MOV = 32
	MG_QUERY_SCH = 64
	MG_PERSONAL_SALE = 128
	MG_PERFORMANCE = 256
	MG_BOX_OFFICE = 512
	MG_TICKET = 1024
	MG_QUERY_TICKET = 2048
)

//表名
const (
	EMPPLYEE = "employee"
	STUDIO   = "studio"
	MOVIE = "movie"
	SEAT = "seat"
)

//职位
const (
	ADMINISTRATOR = 0
	OPERATIONSMANAGER = 1
	CONDUCTOR = 2
	ACCOUNTING = 3
	FINANCIALMANAGER = 4
)

const CONTAIN = "__icontains"
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

type Studio struct {
	StuId int64	 	`orm:"pk;auto" json:"stu_id"`  	//演出厅ID
	StuName string 	`orm:"size(30)" json:"stu_name"` 	//演出厅名字
	StuRows int64  	`json:"stu_rows"`
	StuCols int64 	`json:"stu_cols"`
	StuAvaSeat int64	`json:"stu_ava_seat"`
	Seat []*Seat	`orm:"reverse(many)"` // 设置一对多的反向关系
}

type Movie struct {
	MovId int64	 	`orm:"pk;auto" json:"mov_id"`  	//电影ID
	MovName string 	`orm:"size(30)" json:"mov_name"` 	//电影名字
	MovType string	 `orm:"size(5)"json:"mov_type"` 			//电影类型
	MovComment float64	`json:"mov_comment"` //电影品评分
	MovRel string	`orm:"size(5)" json:"mov_rel"` //电影地区
	MovDescription string	`orm:"size(512)" json:"mov_description"` //电影描述
	MovTime int64 		`json:"mov_time"` //电影时长
	MovImg string 		`json:"mov_img"` //电影图片
}

type Seat struct {
	StId int64	`orm:"pk;auto" json:"st_id"`
	Studio *Studio `orm:"rel(fk)"`    //设置一对多关系
	StRow int64	`json:"st_row"`
	StCol int64	`json:"st_col"`
	StStatus int64	`json:"st_status"` //座位状态 0正常 1坏 2墙壁
}

func init() {
	//连接Mysql数据库
	orm.RegisterDataBase("default", "mysql", "root:123456@tcp(47.94.14.45:3306)/ttms?charset=utf8", 30) //最后是一个超时时间
	//注册model
	orm.RegisterModel(new(Employee),new(Studio),new(Movie),new(Seat))
	//创建表,第二个参数表示如果存在该表是否覆盖
	orm.RunSyncdb("default",false,true)

	logs.Debug("init database .....")
}
