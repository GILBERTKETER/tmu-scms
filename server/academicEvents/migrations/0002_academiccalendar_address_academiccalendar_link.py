# Generated by Django 5.0.6 on 2024-10-26 05:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("academicEvents", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="academiccalendar",
            name="address",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="academiccalendar",
            name="link",
            field=models.URLField(blank=True, null=True),
        ),
    ]