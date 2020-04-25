import dayjs from 'dayjs'

function dateLength(dateBefore,dateAfter){
    return dayjs(dateAfter).diff(dayjs(dateBefore),'day')
}

export{
    dateLength
}