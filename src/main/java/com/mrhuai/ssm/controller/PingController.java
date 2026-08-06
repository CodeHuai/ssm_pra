package com.mrhuai.ssm.controller;

import com.mrhuai.ssm.dao.PingDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@RequestMapping("/ping")
public class PingController {

    @Autowired
    private PingDao pingDao;

    @RequestMapping("/text")
    @ResponseBody
    public String text() {
        return "pong: " + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }

    @RequestMapping("/db")
    @ResponseBody
    public String db() {
        return "db SELECT 1 => " + pingDao.selectOne();
    }

    @RequestMapping("/view")
    public String view(Model model) {
        model.addAttribute("now", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        model.addAttribute("dbResult", pingDao.selectOne());
        return "ping";
    }
}
