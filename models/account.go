package models

import (
	"astaxie/beego/orm"
	"github.com/astaxie/beego/logs"
)

func GetDataByNumAndOffset(tablename string,slice interface{},rowslimit,offset int)(error,int64) {
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
	var p *[]Employee
	switch tablename{
	case EMPPLYEE:
		p = slice.(*[]Employee)
	}

	//查询
	//select * from student limit 5 ;
	ret2, err := qs.Limit(rowslimit,offset) .All(p)

	if err == nil && ret2 > 0 {
		logs.Debug("查询成功",ret2)
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
func SelectEmployeeByPhone(employee *Employee)error {

	o := orm.NewOrm()
	err := o.QueryTable("employee").Filter("emp_phonenumber", (*employee).EmpPhonenumber).One(employee)
	return err

}

func InsertEmployee(employee *Employee)(error,int64) {
	o := orm.NewOrm()
	id,err := o.Insert(employee)
	return err,id
}

func SelectEmployeeById(employee *Employee)error {
	o := orm.NewOrm()
	err := o.Read(employee)
	return err
}
