<?php
	header('Content-Type: application/json');	
	//enter your credentials
	$db_host = 'host';
        $db_username = 'username';
        $db_password = 'password';
        $db_name = 'name';
        $db_port = 'port';

	$con_string = 'host='.$db_host.' dbname='.$db_name.' user='.$db_username.' password='.$db_password;
        $con = pg_connect($con_string);
	if (!$con){
		echo 'No connection!';
	}

	
	if (isset($_GET['request'])){
		echo "[\n";
		if ($_GET['request'] == 'records'){
			$select_lastrecords = 'select * from ('
			.' select distinct on (controller_sensor.id) controller_sensor.id as id_cs, datasensor.date_time from public.datasensor'
			.' inner join public.controller_sensor on public.datasensor .id_controllersensor = public.controller_sensor.id'
			.' order by public.controller_sensor.id, public.datasensor.date_time desc'
			.') t'
			.' order by t.date_time desc';

			$res = pg_query($con, $select_lastrecords);
			while ($row = pg_fetch_row($res)) {
				echo json_encode($row, JSON_FORCE_OBJECT);
  				echo ",\n";
			}
			echo '{"0":"100", "1": "test"}]';
			
	
		}else if ($_GET['request'] == 'sensors'){
			
			$select_query = 'SELECT * FROM public."controller_sensor"';
			$res = pg_query($con, $select_query);
			while ($row = pg_fetch_row($res)) {
				echo json_encode($row, JSON_FORCE_OBJECT);
  				echo ",\n";
			}
			echo '{"0":"test"}]';

	}	
	}else if (isset($_GET['cs'])){
		$cs_id = $_GET['cs'];
		$cs_select_query = "select controllername, sensorname, mac, room, \"dateInstall\", state from public.controller, public.sensor, public.controller_sensor"
					." where public.controller_sensor.id =" .$cs_id." and"
					." public.controller.id = public.controller_sensor.id_controller and"
					." public.sensor.id = public.controller_sensor.id_sensor";
		echo json_encode(pg_fetch_row(pg_query($con, $cs_select_query)), JSON_FORCE_OBJECT);

	}

?>