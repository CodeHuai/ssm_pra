package com.mrhuai.ssm.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PingDao {

    int selectOne();
}
