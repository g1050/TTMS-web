package models

import (
	"fmt"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

const (
	EMPPLYEE = "employee"
)

func GetDataByNumAndOffset2(tablename string,slice interface{},rowslimit,offset int)(error,int64) {
	o := orm.NewOrm()

	//查询数量

	qs := o.QueryTable(tablename)
	ret1,err := qs.Count()

	//查询数量出错
	if err != nil {
		logs.Error(err)
		return err,ret1
	}
	logs.Debug(tablename,"查询到",ret1,"条数据")
	//根据switchcase断言
	switch tablename{
	case EMPPLYEE:
		fmt.Printf("type %f\n",slice.([]Employee))
	}

	//查询
	//select * from student limit 5 ;
	ret2, err := qs.Limit(rowslimit,offset) .All(&slice)

	if err == nil && ret2 > 0 {
		logs.Debug("查询成功")
		/*
		for i := 0; i < len(slice.([]Employee)); i++ {
			logs.Debug(slice.([]Employee)[i])
		}
		 */
	} else {
		logs.Error("查询前n条出错")
	}
	return err,ret1
}
