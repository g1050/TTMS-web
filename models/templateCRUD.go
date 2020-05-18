package models

import (
	"astaxie/beego/logs"
	"astaxie/beego/orm"
)
const (
	EMPPLYEE = "employee"
)

/*数据库查询所有数据,分页展示
slice 切片指针类型，用来返回数据
rowslimie 每次数据条数
offset 页数偏移
orderby 排序关键字
 */
func GetDataByNumAndOffset(tablename string,slice interface{},rowslimit,offset int,orderby string)(error,int64,int64) {
	o := orm.NewOrm()
	logs.Debug(tablename)
	//查询数量
	qs := o.QueryTable(tablename)

	ret1,err := qs.Count()

	//查询数量出错
	if err != nil {
		logs.Error(err)
		return err,ret1,0
	}
	logs.Debug(tablename,"数据库中一共有",ret1,"条数据")

	var ret2 int64
	var err2 error
	//根据switchcase断言
	switch tablename{
	case EMPPLYEE:
		ret2, err2 = qs.OrderBy(orderby).Limit(rowslimit,offset).All(slice.(*[]Employee))
	}

	//查询
	//select * from student limit 5 ;
	if err2 == nil {
		logs.Debug("返回客户端到",ret2,"条数据")
	} else {
		logs.Error("查询",rowslimit,"条出错",err2)
	}
	return err2,ret1,ret2
}

//批量插入　传入slice切片的指针
func InsertMul(tablename string,p interface{})  (error,int64){
	o := orm.NewOrm()
	logs.Debug(tablename)

	var successNums int64
	var err error
	switch tablename {
	case EMPPLYEE:
		successNums, err = o.InsertMulti(100,*(p.(*[]Employee)))
	}

	if err != nil {
		logs.Error("批量插入出错",err)
	} else {
		logs.Debug("成功插入数据",successNums,"条")
	}

	return err,successNums
}

/*
单个插入
tablename 要插入的表的名字
p 是一个结构体指针根据tablename转换
 */
func InsertByTableName(tablename string,p interface{})error {
	o := orm.NewOrm()

	var err error
	switch tablename {
	case EMPPLYEE:
		_,err = o.Insert(p.(*Employee))
	}

	//logs.Debug(id,err)
	return err
}



func CheckExist(tablename , key , value string)bool {
	o := orm.NewOrm()
	var res bool

	logs.Debug("func:CheckExist Tablename ",tablename)
	switch tablename {
	case EMPPLYEE:
		res = o.QueryTable(tablename).Filter(key, value).Exist()
	}

	return res
}

func GetId(tablename ,key ,value string)int64  {
	logs.Debug("func: GetId tablename: ",tablename)

	o := orm.NewOrm()
	qs := o.QueryTable(tablename)
	var ret int64
	switch tablename {
	case tablename:
		e := Employee{}
		qs.Filter(key,value).One(&e)
		ret = e.EmpId
	}

	return ret
}

/*
单个修改数据
tablename 表名字
p　要修改的数据的结构体指针
*/
func UpdateByTablename(tablename string, p interface{}) error {
	logs.Debug("func UpdateByTablename tablename:",tablename)

	o := orm.NewOrm()
	var err error
	switch tablename {
	case EMPPLYEE:
		_,err = o.Update(p.(*Employee))

	}
	if err != nil{
		logs.Error(err)
	}

	return err
}