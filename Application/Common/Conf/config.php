<?php
/**
 * 配置项数组合并
 * @author Link <612012@qq.com>
 */
return array_merge(
	include("common.config.php"),
	include("system.config.php"),
	include("db.config.php")
);