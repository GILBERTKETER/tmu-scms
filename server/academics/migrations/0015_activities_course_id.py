# Generated by Django 5.0.6 on 2024-11-07 04:05

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0014_alter_course_code"),
    ]

    operations = [
        migrations.AddField(
            model_name="activities",
            name="course_id",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
