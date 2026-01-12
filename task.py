from workers import celery
from celery.schedules import crontab
from models import *
from flask import render_template
from datetime import datetime, timedelta
from mailer import *

@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):

    sender.add_periodic_task(crontab(minute=0, hour=0), daily.s(), name='daily') # Runs daily at midnight
    
    # sender.add_periodic_task(30, daily.s(), name='daily')

    sender.add_periodic_task(crontab(minute=0, hour=0, day_of_month=1), monthly.s(), name='monthly') # Runs monthly on the 1st day of the month
    # sender.add_periodic_task(30, monthly.s(), name='monthly')

@celery.task
def add_together():
    a=1
    b=2
    return a + b

@celery.task
def daily():
    subject = "Daily Reminder"
    twenty_four_hrs_ago = datetime.now() - timedelta(hours=24)
    inactive_users = User.query.filter(User.last_login < twenty_four_hrs_ago).all()
    print(len(inactive_users))
    for user in inactive_users:
        print(f"sending daily reminder to {user.email}")
        send_email(subject=subject, to=user.email, html_body=render_template('daily.html', user=user))
        print(f"sent daily reminder to {user.email}")
    return "Daily Success"

@celery.task
def monthly():
    subject = "Monthly Report"

    creators = User.query.join(RolesUsers).join(Role).filter(Role.name == 'creator').all()

    today = datetime.today()
    last_month_end = datetime(today.year, today.month, 1) - timedelta(days=1)
    last_month_start = datetime(last_month_end.year, last_month_end.month, 1)


    for user in creators:
        
        songs_last_month = Song.query.filter(Song.song_creator == user.id, Song.song_creation_date >= last_month_start, Song.song_creation_date <= last_month_end).all()

        albums_last_month = Album.query.filter(Album.album_artist == user.id, Album.album_creation_date >= last_month_start, Album.album_creation_date <= last_month_end).all()

        new_song_ratings = db.session.query(Song.song_id, Song.song_title, func.count(Song_Rating.sr_id).label('rating'), func.avg(Song_Rating.song_rating).label('avg_rating')).join(Song_Rating).filter(Song.song_creator == user.id, Song_Rating.song_id == Song.song_id, Song_Rating.rating_given_date >= last_month_start, Song_Rating.rating_given_date <= last_month_end).group_by(Song.song_id, Song.song_title).all()
        
        new_album_ratings = db.session.query(Album.album_id, Album.album_name, func.count(Album_Rating.ar_id).label('rating'), func.avg(Album_Rating.album_rating).label('avg_rating')).join(Album_Rating).filter(Album.album_artist == user.id, Album_Rating.album_id == Album.album_id, Album_Rating.rating_given_date >= last_month_start, Album_Rating.rating_given_date <= last_month_end).group_by(Album.album_id, Album.album_name).all()

        print(f"sending monthly report to {user.email}")
        send_email(subject=subject, to=user.email, html_body=render_template('monthly.html', user=user, songs=songs_last_month, albums=albums_last_month, song_ratings=new_song_ratings, album_ratings=new_album_ratings))
        print(f"sent monthly report to {user.email}")

    return "Monthly Success"
