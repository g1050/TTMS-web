package models

import (
	"astaxie/beego/logs"
	"astaxie/beego/orm"
)

/*
为了统计业绩、票房
定义临时数据结构
 */
type Tmp struct {
	Id       int64 `json:"id"`
	SumPrice float64 `json:"sum_price"`
	Name string
}


/*
统计销售额,通过视图
 */
func QueryPerformance(offset,rowslimit int)([]Tmp,int64,error){
	o := orm.NewOrm()
	var tmp []Tmp

	num, err := o.Raw("SELECT id, sum_price from v1 LIMIT ?,?",offset,rowslimit).QueryRows(&tmp)
	return tmp,num,err
}

/*
统计票房
 */
func QueryBoxOffice(offset,rowslimit int)([]Tmp,int64,error){
	o := orm.NewOrm()
	var tmp []Tmp

	num, err := o.Raw("SELECT id, sum_price from v2 LIMIT ?,?",offset,rowslimit).QueryRows(&tmp)
	return tmp,num,err
}

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
		ret2, err2 = qs.OrderBy(orderby).All(slice.(*[]Movie))
	case SCHEDULE:
		ret2,err = qs.OrderBy(orderby).Limit(rowslimit,offset).RelatedSel().All(slice.(*[]Schedule))
	case TICKET:
		ret2, err2 = qs.OrderBy(orderby).Limit(rowslimit,offset).RelatedSel().All(slice.(*[]Ticket))
	case RECORD:
		ret2, err2 = qs.OrderBy(orderby).Limit(rowslimit,offset).RelatedSel().All(slice.(*[]Record))
		//ret2, err2 = qs.OrderBy(orderby).Limit(rowslimit,offset).RelatedSel().All(slice.(*[]Record))
		//ret2, err2 = qs.RelatedSel().All(slice.(*[]Record))

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
	case SCHEDULE:
		num,err = o.Insert(p.(*Schedule))
	case TICKET:
		num,err = o.Insert(p.(*Ticket))
	case RECORD:
		num,err = o.Insert(p.(*Record))


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

func GetId(tablename ,key string,value interface{})int64  {
	logs.Debug("func: GetId tablename: ",tablename)

	o := orm.NewOrm()
	qs := o.QueryTable(tablename)
	var ret int64
	switch tablename {
	case EMPPLYEE:
		e := Employee{}
		qs.Filter(key,value.(string)).One(&e)
		ret = e.EmpId
	case RECORD:
		r := Record{}
		qs.Filter(key,value.(int64)).One(&r)
		ret = r.RecId
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
	case SCHEDULE:
		_,err = o.Update(p.(*Schedule))

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
	case SCHEDULE:
		num,err = o.Delete(p.(*Schedule))
	case RECORD:
		num,err = o.Delete(p.(*Record))
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
根据key和value获取数据,精确搜索
不同于按照值模糊匹配
 */
func GetDataByFieldAndValue(tablename,field string, value interface{},container interface{})(int64,error)   {
	o := orm.NewOrm()
	var qs orm.QuerySeter
	var num int64
	var err error

	qs = o.QueryTable(tablename)
	switch tablename {
	case SCHEDULE:
		num,err = qs.Filter(field,value.(int64)).All(container.(*[]Schedule))
	case TICKET:
		num,err = qs.Filter(field,value.(int64)).All(container.(*[]Ticket))

	}
	return num,err
}

/*
模糊查询模板,like '%a%'
 */
func GetHintByFieldAndValue(tablename,field string, value interface{},container interface{})(int64,error){
	o := orm.NewOrm()
	var qs orm.QuerySeter
	var num int64
	var err error

	qs = o.QueryTable(tablename)
	switch tablename{
	case EMPPLYEE:
		num,err = qs.Filter(field+CONTAIN,value.(string)).All(container.(*[]Employee))
	case STUDIO:
		num,err = qs.Filter(field+CONTAIN,value.(string)).All(container.(*[]Studio))
	case MOVIE:
		num,err = qs.Filter(field+CONTAIN,value.(string)).All(container.(*[]Movie))
	case SCHEDULE:
		num,err = qs.Filter(field,value.(int64)).All(container.(*[]Schedule))





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
	case STUDIO:
		num,err = o.Update(p.(*Studio),field)
	case TICKET:
		num,err = o.Update(p.(*Ticket),field)
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
	case EMPPLYEE:
		err = o.Read(p.(*Employee))
	case SCHEDULE:
		err = o.Read(p.(*Schedule))
	case MOVIE:
		err = o.Read(p.(*Movie))
	case TICKET:
		/*
		err = o.Read(p.(*Ticket))
		 */
		err = o.QueryTable(tablename).Filter("tic_id", p.(*Ticket).TicId).RelatedSel().One(p.(*Ticket))
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

/*
tablename 说明是那个模块
add说明要添加的对象的字段名字
sta 是含ID的对象,指针类型
change 是添加的对象
 */
func AddManyToMany(tablename, add string,sta ,change interface{})(int64,error){
	o := orm.NewOrm()

	var num int64
	var err error

	switch tablename{
	case SCHEDULE:
		m2m := o.QueryM2M(sta.(*Schedule), add)
		switch add {
		case "Studios":
			num,err = m2m.Add(change.(Studio))
		case "Movies":
			num,err = m2m.Add(change.(Movie))
		}
	}
	return num,err

}

func ClearManyToMany(tablename, add string,sta interface{})(int64,error) {
	o := orm.NewOrm()
	var  m2m orm.QueryM2Mer

	switch tablename{
	case SCHEDULE:
		m2m = o.QueryM2M(sta.(*Schedule), add)
	}

	num,err := m2m.Clear()
	return num,err

}

func RelateQuery(tablename string,p interface{})(int64,error) {
	o := orm.NewOrm()

	var num int64
	var err error
	switch tablename {
	case SCHEDULE:
		num,err = o.QueryTable(tablename)	.RelatedSel().All(p.(*[]Schedule))
	}
	return num,err
}

func ManyToOneReverse(tablename string,param,p interface{})error {
	o := orm.NewOrm()

	var err error
	switch tablename {
	case STUDIO:
		err = o.QueryTable(tablename).Filter("Seat__StId",param.(int64)).Limit(1).One(p.(*Studio))

	}
	return err
}
