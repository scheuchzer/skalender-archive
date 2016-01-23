\copy (select array_to_json(array_agg(row_to_json(cc))) from (
	select row_to_json(t) from (select c.uid, c.name, v.name as venue, v.zip, v.city, c.date, c.hasPics, (
		select array_to_json(array_agg(row_to_json(d))) from (
			select b.uid, b.name from band_concert bc left outer join band b on bc.bandId=b.uid where c.uid=bc.concertId) d
		) 
	as bands, (
		select array_to_json(array_agg(row_to_json(pp))) from (
			select p.name from pics p where c.uid=p.concertId order by p.name
			) 
		pp
		) 
	as pics from concert c left outer join venue v on c.venueId=v.uid where CAST(date as DATE) > '1990-01-01'and CAST(date as DATE) < '2017-01-01' order by date) as t) as cc) to '/home/celli/t.json'