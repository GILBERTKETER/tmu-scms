# Generated by Django 5.0.6 on 2024-11-06 13:19

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0013_alter_course_year"),
    ]

    operations = [
        migrations.AlterField(
            model_name="course",
            name="code",
            field=models.CharField(max_length=10),
        ),
    ]
