package com.huai.ssm.service;

import com.huai.ssm.bean.FurnBean;

import java.util.List;

public interface FurnService {
    public void save(FurnBean furnBean);

    public List<FurnBean> getAllFurns();
}
