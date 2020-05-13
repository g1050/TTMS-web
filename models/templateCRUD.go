package models

import (
	"astaxie/beego/logs"
	"astaxie/beego/orm"
)
const (
	EMPPLYEE = "employee"
)

func GetDataByNumAndOffset(tablename string,slice interface{},rowslimit,offset int)(error,int64,int64) {
	o := orm.NewOrm()
	o.Using("default")
	//查询数量
	qs := o.QueryTable(tablename)
	ret1,err := qs.Count()

	//查询数量出错
	if err != nil {
		logs.Error(err)
		return err,ret1,0
	}
	logs.Debug(tablename,"数据库中一共有",ret1,"条数据")

	//根据switchcase断言
	var p *[]Employee
	switch tablename{
	case EMPPLYEE:
		p = slice.(*[]Employee)
	}

	//查询
	//select * from student limit 5 ;
	ret2, err2 := qs.Limit(rowslimit,offset) .All(p)
	if err2 == nil {
		logs.Debug("返回客户端到",ret2,"条数据")
	} else {
		logs.Error("查询",rowslimit,"条出错")
	}
	return err2,ret1,ret2
}

