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
	SCHEDULE = "schedule"
	TICKET = "ticket"
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
//员工表
type Employee struct {
	EmpId 			int64 	`orm:"pk;auto" json:"emp_id"`//员工ID
	//Emp_LoginName 	string 	`orm:"size(30)" json:"emp_login_name"`//员工姓名
	EmpPassword 	string 	`orm:"size(32)" json:"emp_password"`//密码
	EmpName 		string 	`orm:"size(30)" json:"emp_name"`//名字
	EmpBornyear 	string 	`orm:"size(10)" json:"emp_born_year"`//出生年月
	EmpPhonenumber string 	`orm:"size(15);unique" json:"emp_phonenumber"`//手机号
	EmpPrivilege 	int 	`json:"emp_privilege"`//权限

	//用来统计销售额
}
//演出厅表
type Studio struct {
	StuId int64	 	`orm:"pk;auto" json:"stu_id"`  	//演出厅ID
	StuName string 	`orm:"size(30)" json:"stu_name"` 	//演出厅名字

	/*
	StuRows int64  	`json:"stu_rows"`
	StuCols int64 	`json:"stu_cols"`
	 */

	StuType int64   `json:"stu_type"`
	StuSize int64	`json:"stu_size"`
	StuAvaSeat int64	`json:"stu_ava_seat"`

	Seat []*Seat	`orm:"reverse(many)" json:"-"` // 设置一对多的反向关系
	//Schedules []*Schedule `orm:"reverse(many)" json:"-"` //设置多对多反向关系
}
//电影表
type Movie struct {
	MovId int64	 	`orm:"pk;auto" json:"mov_id"`  	//电影ID
	MovName string 	`orm:"size(30)" json:"mov_name"` 	//电影名字
	MovType string	 `orm:"size(5)"json:"mov_type"` 			//电影类型
	MovComment float64	`json:"mov_comment"` //电影品评分
	MovRel string	`orm:"size(5)" json:"mov_rel"` //电影地区
	MovDescription string	`orm:"size(512)" json:"mov_description"` //电影描述
	MovTime int64 		`json:"mov_time"` //电影时长
	MovImg string 		`json:"mov_img"` //电影图片

	//Schedules []*Schedule `rm:"reverse(many)" json:"-"` //设置多对多反向关系
}

//座位表,座位表和演出厅表是一对多关系,演出厅ID作为座位的外键
type Seat struct {
	StId int64	`orm:"pk;auto" json:"st_id"`
	StRow int64	`json:"st_row"`
	StCol int64	`json:"st_col"`
	StStatus int64	`json:"st_status"` //座位状态 0正常 1坏 2墙壁

	Studio *Studio`orm:"rel(fk)" json:"-"`    //设置一对多关系
}

//演出计划表,与演出厅和电影都是多对多的关系
//修改关系为一对一,演出厅ID和电影的ID作为演出计划的ID
type Schedule struct {
	SchId int64 `orm:"pk;auto" json:"sch_id"`
	SchTime string `json:"sch_time"` //采用string 类型存储
	Studio *Studio	`orm:"rel(one)" json:"-"` //该字段不需要返回给客户端
	Movie *Movie	`orm:"rel(one)" json:"-"` //不打包

	StuName string `json:"stu_name"`
	MovName string `json:"mov_name"`

	SchStuId int64 `json:"sch_stu_id"`
	SchMovId int64 `json:"sch_mov_id"`

	SchPrice float64 `json:"sch_price"`

	/*
	Studios []*Studio`orm:"rel(m2m)" json:"studios"`
	Movies []*Movie 	`orm:"rel(m2m)" json:"movies"`
	 */

}

/*
电影票表结构的定义，
需要在生成演出计划的时候就票信息添加到数据库中去
 */
type Ticket struct {
	//必要的字段
	TicId int64 `orm:"pk;auto" json:"tic_id"`
	TicSchId int64
	TicStatus int64 //已经售出 未售出
	TicEmpId int64
	TicMovId int64

	Seat *Seat 		`orm:"rel(fk)" json:"seat"` //座位信息需要返回,一对多关系,一个座位对应多张票

	/*
	Employee *Employee	`orm:"rel(fk)"` //一对一关系,用来统计销售业绩
	 */

	//人性化展示
	TicStuName string
	TicMovName string

}
func init() {
	//连接Mysql数据库
	orm.RegisterDataBase("default", "mysql", "root:123456@tcp(47.94.14.45:3306)/ttms?charset=utf8", 30) //最后是一个超时时间
	//注册model
	orm.RegisterModel(new(Employee),new(Studio),new(Movie),new(Seat),new(Schedule),new(Ticket))
	//创建表,第二个参数表示如果存在该表是否覆盖
	orm.RunSyncdb("default",false,true)

	logs.Debug("init database .....")
}
