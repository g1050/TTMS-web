package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego/logs"
	"strconv"
	"ttms/models"
)

type TicketController struct {
	BaseController
}

//批量获取,排序,分页显示
func (c *TicketController)GetTicket() {
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_QUERY_TICKET); !ok {
		return
	}

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取票务信息第",page,"页")

	slice := []models.Ticket{}
	//返回情况返回相应数据
	//models.T()
	err,sum,ret2 := models.GetDataByNumAndOffset(models.TICKET,&slice,10,(page-1)*10,"tic_sch_id")
	if err != nil || ret2 == 0{
		logs.Error("查询n条数据出错")
		c.resp["sum"] = 0
		c.PackRecode(c.resp,models.RECODE_DBERR) //数据库错误
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)
	c.resp["sum"] = sum
	c.resp["data"] = slice
	logs.Debug("从数据库存中获得数据",slice)
	logs.Debug(c.resp)
}

//批量获取,排序,分页显示
func (c *TicketController)GetTicketByScheduleId() {

	logs.Debug("根据演出厅ID获取所有票的数据")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_QUERY_TICKET); !ok {
		return
	}

	sch_id,_ := c.GetInt64("sch_id")
	logs.Debug("获取票务信息演出厅ID",sch_id)

	slice := []models.Ticket{}
	//返回情况返回相应数据
	//models.T()

	num,err := models.GetDataByFieldAndValue(models.TICKET,"tic_sch_id",sch_id,&slice)
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR)
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)
	c.resp["sum"] = num
	c.resp["data"] = slice
	logs.Debug("从数据库存中获得数据",slice)
	logs.Debug(c.resp)
}

/*
卖出票,
其实就是把票改为售出的状态
*/
type TicketArr struct {
	MTicket []models.Ticket `json:"m_ticket"`
}
func (c *TicketController)UpdateTicket() {
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_TICKET); !ok {
		return
	}

	data := TicketArr{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数组是",data)


	mov := models.Movie{}
	sch := models.Schedule{}
	emp := models.Employee{}
	//修改
	for _,value := range data.MTicket{
		value.TicStatus = 1
		_, err := models.UpdateByTablenameAndField(models.TICKET,"tic_status",&value)
		//返回结果
		if err != nil {
			logs.Error(err)
			c.PackRecode(c.resp, models.RECODE_DBERR) //4001　插入失败
			return
		}

		//查询ticket
		models.GetDataById(models.TICKET,&value)
		logs.Debug("买票时候取到的票的信息是",value)
		//生成订单
		rec := models.Record{}
		//构造movie
		mov.MovId = value.TicMovId
		rec.Movie = &mov
		//构造演出计划
		sch.SchId = value.TicSchId
		rec.Schedule = &sch
		//构造员工
		emp.EmpId = value.TicEmpId
		rec.Employee = &emp
		//构造票的信息
		rec.Ticket = &value

		num,err := models.InsertByTableName(models.RECORD,&rec)
		if err != nil {
			logs.Error(num,err)
			c.PackRecode(c.resp,models.RECODE_DBERR)
			return
		}
		logs.Debug("生成销售记录是:",rec)

	}

	c.PackRecode(c.resp,models.RECODE_OK)

}

/*
退票只能一张一张退
 */
func (c *TicketController)UpdateTicketReturn() {
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_TICKET); !ok {
		return
	}

	data := models.Ticket{}
	/*
	data.TicId = 1
	str,_ := json.Marshal(data)
	logs.Debug("%s",str)
	 */
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)

	//修改票的信息
	data.TicStatus = 0
	logs.Debug("从前段获取的数组是",data)
	_, err := models.UpdateByTablenameAndField(models.TICKET,"tic_status",&data)
	//返回结果
	if err != nil {
		logs.Error(err)
		c.PackRecode(c.resp, models.RECODE_DBERR) //4001　插入失败
		return
	}

	//删除订单
	rec := models.Record{}
	//删除订单
	rec.RecId = models.GetId(models.RECORD,"ticket_id",data.TicId)
	num,err := models.DeleteByTablename(models.RECORD,&rec)

	if err != nil {
		logs.Error(num,err)
		c.PackRecode(c.resp,models.RECODE_DBERR)
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)

}

func (c *TicketController)GetTicketById()  {
	logs.Debug("通过Id来获取票")

	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_QUERY_TICKET); !ok {
		return
	}

	id,_:= c.GetInt64("tic_id")
	logs.Debug("要查询的票的Id是",id)

	ticket := models.Ticket{TicId:id}
	err := models.GetDataById(models.TICKET,&ticket)
	logs.Debug("查到的ticket是",ticket)
	if err != nil {
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_DBERR)
		return
	}


	c.resp["data"] = ticket
	c.PackRecode(c.resp,models.RECODE_OK)
}