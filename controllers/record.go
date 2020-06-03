package controllers

import (
	"astaxie/beego/logs"
	"strconv"
	"time"
	"ttms/models"
)

type RecordController struct {
	BaseController
}

/*
原生结构体中包含的信息太多了
 */
type RecordSend struct {
	RecId int64  `orm:"pk;auto"`
	EmpName string
	MovieName string
	Created time.Time
	TicketId int64
	ScheduleId int64
	TicketPrice float64
}

//批量获取,排序,分页显示
func (c *RecordController)GetRecord() {
	logs.Debug("获取所有订单")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_BOX_OFFICE); !ok {
		return
	}

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取订单信息第",page,"页")

	slice := []models.Record{}
	//返回情况返回相应数据
	//models.T()Lw
	err,sum,ret2 := models.GetDataByNumAndOffset(models.RECORD,&slice,10,(page-1)*10,"created")
	logs.Debug("从数据库存中获得数据",slice)
	if err != nil || ret2 == 0{
		logs.Error("查询n条数据出错",err,sum,ret2)
		c.resp["sum"] = 0
		c.PackRecode(c.resp,models.RECODE_DBERR) //数据库错误
		return
	}

	//重新封装返回的信息
	ret := make([]RecordSend,0)
	tmp := RecordSend{}
	for _,value := range slice {
		tmp.RecId = value.RecId
		tmp.EmpName = value.Employee.EmpName
		tmp.Created = value.Created
		tmp.MovieName = value.Movie.MovName
		tmp.ScheduleId = value.Schedule.SchId
		tmp.TicketId = value.Ticket.TicId
		tmp.TicketPrice = value.Schedule.SchPrice
		ret = append(ret,tmp)
	}


	c.PackRecode(c.resp,models.RECODE_OK)
	c.resp["sum"] = sum
	c.resp["data"] = ret
	logs.Debug(c.resp)
}

/*
查询业绩,分页,分组
 */
func (c *RecordController)GetPerformance() {
	logs.Debug("获取所有订单")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_BOX_OFFICE); !ok {
		return
	}

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取订单信息第",page,"页")

	//使用sql语句查询,没有找到很好的解决办法,实际上是通过ticket来查询的
	//注意参数顺序是反过来的
	tmp,num,err := models.QueryPerformance((page-1)*10,10)

	if err != nil {
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_DBERR)
		return
	}

	//查询name
	for index,value := range tmp {
		emp := models.Employee{EmpId:value.Id}
		models.GetDataById(models.EMPPLYEE,&emp)
		tmp[index].Name = emp.EmpName
	}
	logs.Debug("统计业绩时候查到的数据是",tmp,num)

	c.resp["data"] = tmp
	c.resp["sum"] = num
	c.PackRecode(c.resp,models.RECODE_OK)
}

/*
查询业绩,分页,分组
*/
func (c *RecordController)GetBoxOffice() {
	logs.Debug("获取所有订单")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_BOX_OFFICE); !ok {
		return
	}

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取订单信息第",page,"页")

	//使用sql语句查询,没有找到很好的解决办法,实际上是通过ticket来查询的
	//注意参数顺序是反过来的
	tmp,num,err := models.QueryPerformance((page-1)*10,10)

	if err != nil {
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_DBERR)
		return
	}

	//查询name
	for index,value := range tmp {
		emp := models.Employee{EmpId:value.Id}
		models.GetDataById(models.EMPPLYEE,&emp)
		tmp[index].Name = emp.EmpName
	}
	logs.Debug("统计业绩时候查到的数据是",tmp,num)

	c.resp["data"] = tmp
	c.resp["sum"] = num
	c.PackRecode(c.resp,models.RECODE_OK)
}