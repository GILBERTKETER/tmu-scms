# Generated by Django 5.0.6 on 2024-11-11 04:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0016_alter_course_year"),
    ]

    operations = [
        migrations.AlterField(
            model_name="instructor",
            name="expertise",
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
