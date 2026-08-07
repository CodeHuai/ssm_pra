package com.huai.ssm.controller;

import com.huai.ssm.bean.FurnBean;
import com.huai.ssm.service.FurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FurnController {

    @Autowired
    private FurnService furnService;

    @PostMapping("/addFurn")
    public void addFurn(@RequestBody FurnBean furnBean) {
        furnService.save(furnBean);
    }
}
