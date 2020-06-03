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
func (c *TicketController)UpdateTIcket() {
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_TICKET); !ok {
		return
	}

	data := TicketArr{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数组是",data)

	/*
	t := models.Ticket{TicId:1}
	tmp := TicketArr{}
	tmp.MTicket= append(tmp.ticket,t)
	tmp.MTicket= append(tmp.ticket,t)
	tmp.MTicket= append(tmp.ticket,t)

	str,err2 := json.Marshal(tmp.ticket)


	logs.Debug("打包成json%s\n",str,err2)
	logs.Debug(tmp)
	*/

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
	}
	c.PackRecode(c.resp,models.RECODE_OK)

}

func (c *TicketController)GetTicketById()  {
	logs.Debug("通过Id来获取票")

	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

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