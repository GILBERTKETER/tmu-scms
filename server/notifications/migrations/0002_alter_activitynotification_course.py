# Generated by Django 5.0.6 on 2024-11-09 19:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("notifications", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="activitynotification",
            name="course",
            field=models.TextField(default=""),
        ),
    ]
