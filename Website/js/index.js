$.getJSON('data/teacher1.json',function(data){
    $.each(data, function(key, val) {
        $("#about #teacher-name").text(val.first_name + " " + val.middle_name + " " + val.last_name);
        $("#about #dob").text("DOB:" + " " + val.birthdate);
        $("#about #title").text(val.title);
        $("#about #address").text(val.address);
        $("#about #phone").text("Phone:" + " " + val.phone);
        $("#about #email").text("Email:" + " " + val.email);

        $("#education #pgi").text(val.pgInstitute);
        $("#education #pgcourse").text(val.pgCourse);
        $("#education #pgu").text(val.pgUniversity);
        $("#education #pgr").text(val.pgRegular);
        $("#education #pgscore").text(val.pgScore);
        $("#education #pgduration").text(val.pgDuration);

        $("#education #ugi").text(val.ugInstitute);
        $("#education #ugcourse").text(val.ugCourse);
        $("#education #ugu").text(val.ugUniversity);
        $("#education #ugr").text(val.ugRegular);
        $("#education #ugscore").text(val.ugScore);
        $("#education #ugduration").text(val.ugDuration);

        $("#experience #tpost").text(val.tpost);
        $("#experience #tinstitute").text(val.tinstitute);
        $("#experience #tduration").text(val.tduration);

        $("#experience #ipost").text(val.ipost);
        $("#experience #iinstitute").text(val.icompany);
        $("#experience #iduration").text(val.iduration);

        $("#experience #opost").text(val.opost);
        $("#experience #oinstitute").text(val.ocompany);
        $("#experience #oduration").text(val.oduration);
        

    })
});


