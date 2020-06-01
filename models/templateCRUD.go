package models

import (
	"astaxie/beego/logs"
	"astaxie/beego/orm"
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
	case STUDIO:
		ret2, err2 = qs.OrderBy(orderby).Limit(rowslimit,offset).All(slice.(*[]Studio))
	case MOVIE:
		ret2, err2 = qs.OrderBy(orderby).Limit(rowslimit,offset).All(slice.(*[]Movie))

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
func InsertByTableName(tablename string,p interface{})( int64,error) {
	o := orm.NewOrm()

	var err error
	var num int64
	switch tablename {
	case EMPPLYEE:
		_,err = o.Insert(p.(*Employee))
	case STUDIO:
		_,err = o.Insert(p.(*Studio))
	case MOVIE:
		num,err = o.Insert(p.(*Movie))
	case SEAT:
		num,err = o.Insert(p.(*Seat))


	}

	//logs.Debug(id,err)
	return num,err
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
	case STUDIO:
		_,err = o.Update(p.(*Studio))
	case MOVIE:
		_,err = o.Update(p.(*Movie))

	}
	if err != nil{
		logs.Error(err)
	}

	return err
}

/*
单个删除数据
tablename 表名字
p　要修改的数据的结构体指针
*/
func DeleteByTablename(tablename string, p interface{}) (int64,error) {
	logs.Debug("func DeleteByTablename tablename:",tablename)

	o := orm.NewOrm()
	var err error
	var num int64
	switch tablename {
	case EMPPLYEE:
		num,err = o.Delete(p.(*Employee))
	case STUDIO:
		num,err = o.Delete(p.(*Studio))

	case MOVIE:
		num,err = o.Delete(p.(*Movie))
	case SEAT:
		num,err = o.Delete(p.(*Seat))

	}
	if err != nil{
		logs.Error(err)
	}

	//ID删除后不连续
	/*
	cnt,_ := o.QueryTable(tablename).Count()
	str := "alter table " + tablename + " auto_increment=" + strconv.Itoa(int(cnt+1));
	o.Raw(str).Exec()
	 */

	return num,err
}

/*
模糊查询模板,like '%a%'
 */
func GetHintByFieldAndValue(tablename,field , value string,container interface{})(int64,error){
	o := orm.NewOrm()
	var qs orm.QuerySeter
	var num int64
	var err error

	switch tablename{
	case EMPPLYEE:
		qs = o.QueryTable(tablename)
		num,err = qs.Filter(field+CONTAIN,value).All(container.(*[]Employee), field)
	case STUDIO:
		qs = o.QueryTable(tablename)
		num,err = qs.Filter(field+CONTAIN,value).All(container.(*[]Studio), field)
	case MOVIE:
		qs = o.QueryTable(tablename)
		num,err = qs.Filter(field+CONTAIN,value).All(container.(*[]Movie), field)




	}

	return num,err

}

/*
更新某个字段
 */
func UpdateByTablenameAndField(tablename , field string,p interface{})(int64,error) {
	o := orm.NewOrm()

	var num int64
	var err error
	switch tablename {
	case MOVIE:
		num,err = o.Update(p.(*Movie),field)
	case SEAT:
		num,err = o.Update(p.(*Seat),field)
	}
	return num,err
}

/*
通过ID来获取数据
 */
func GetDataById(tablename string, p interface{})error {

	o := orm.NewOrm()
	var err error
	switch tablename {
	case STUDIO:
		err = o.Read(p.(*Studio))

	}
	return err
}

/*
查询一对多关系
 */
func QuertOneToMany(tablename,fk string,id int64,p interface{}) (int64,error){

	o := orm.NewOrm()
	var num int64
	var err error

	switch tablename {
	case SEAT:
		num, err = o.QueryTable(tablename).Filter(fk, id).RelatedSel().All(p.(*[]*Seat))

	}

	return num,err

}